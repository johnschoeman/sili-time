import * as DayTime from "./dayTime"
import { E, F, O, T, TE } from "./fpts"
import * as Posix from "./posix"
import * as SiliTime from "./siliTime"

import "./index.css"

import * as D from "io-ts/Decoder"
import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import { render } from "solid-js/web"

const SUNRISE_SUNSET_API = "https://api.sunrise-sunset.org/json"
const POLL_INTERVAL = 100

type Lat = number
type Lng = number
type Coord = [Lat, Lng]

const showCoord = (coord: Coord): string => {
  const [lat, lng] = coord
  const latText = String(lat).slice(0, 7)
  const lngText = String(lng).slice(0, 7)
  return `Lat: ${latText} Lng: ${lngText}`
}

// TimeStrings are in UTC
type SunResponse = {
  status: "OK"
  results: {
    sunrise: DayTime.DayTimeString
    sunset: DayTime.DayTimeString
    solar_noon: DayTime.DayTimeString
    day_length: DayTime.DayTimeString
    civil_twilight_begin: DayTime.DayTimeString
    civil_twilight_end: DayTime.DayTimeString
    nautical_twilight_begin: DayTime.DayTimeString
    nautical_twilight_end: DayTime.DayTimeString
    astronomical_twilight_begin: DayTime.DayTimeString
    astronomical_twilight_end: DayTime.DayTimeString
  }
}

type Seconds = number
type UTCOffset = Seconds

const secondsInADay = 24 * 60 * 60

const toSunData = (sunResponse: SunResponse, utcOffset: UTCOffset): SunData => {
  const {
    results: { sunrise, sunset },
  } = sunResponse

  const sunriseSec = mod(DayTime.dayTimeStringToSeconds(sunrise) - utcOffset)(
    secondsInADay,
  )
  const sunsetSec = mod(DayTime.dayTimeStringToSeconds(sunset) - utcOffset)(
    secondsInADay,
  )

  return {
    sunriseSec,
    sunsetSec,
  }
}

const mod =
  (n: number) =>
  (d: number): number => {
    return ((n % d) + d) % d
  }

type SunData = {
  sunriseSec: Seconds
  sunsetSec: Seconds
}

const defaultSunData: SunData = {
  sunriseSec: 21600,
  sunsetSec: 43200 + 28600,
}

const showSunData = (sunData: SunData): string => {
  const { sunriseSec, sunsetSec } = sunData
  const sunriseDayTime = DayTime.fromSeconds(sunriseSec)
  const sunsetDayTime = DayTime.fromSeconds(sunsetSec)
  return `sunrise: ${DayTime.show(sunriseDayTime)} sunset: ${DayTime.show(
    sunsetDayTime,
  )}`
}

const sunResponseDecoder: D.Decoder<unknown, SunResponse> = D.struct({
  status: D.literal("OK"),
  results: D.struct({
    sunrise: D.string,
    sunset: D.string,
    solar_noon: D.string,
    day_length: D.string,
    civil_twilight_begin: D.string,
    civil_twilight_end: D.string,
    nautical_twilight_begin: D.string,
    nautical_twilight_end: D.string,
    astronomical_twilight_begin: D.string,
    astronomical_twilight_end: D.string,
  }),
})

const decodeWith =
  <T extends unknown>(decoder: D.Decoder<unknown, T>) =>
  (value: unknown): TE.TaskEither<Error, T> => {
    return F.pipe(
      value,
      decoder.decode,
      E.mapLeft(err => new Error(D.draw(err))),
      TE.fromEither,
    )
  }

const fetchSunriseSunset = (
  coords: Coord,
): TE.TaskEither<Error, SunResponse> => {
  const [lat, lng] = coords
  const url = new URL(SUNRISE_SUNSET_API)
  url.searchParams.set("lat", String(lat))
  url.searchParams.set("lng", String(lng))
  url.searchParams.set("formatted", String(1))

  return F.pipe(
    TE.tryCatch(
      async () => {
        const result = await fetch(url, {
          method: "GET",
        })
        const data = (await result.json()) as unknown
        return data
      },
      reason => new Error(`${reason}`),
    ),
    TE.chain(decodeWith(sunResponseDecoder)),
  )
}

const [now, setNow] = createSignal<Posix.Posix>(Date.now())
const [location, setLocation] = createSignal<O.Option<Coord>>(O.none)
const [sunData, setSunData] = createSignal<O.Option<SunData>>(O.none)
const [displayError, setDisplayError] = createSignal<O.Option<Error>>(O.none)

navigator.geolocation.getCurrentPosition(
  ({ coords: { latitude, longitude } }) => {
    const coord: Coord = [latitude, longitude]

    setLocation(() => {
      console.log(coord)
      return O.some(coord)
    })

    void F.pipe(
      coord,
      fetchSunriseSunset,
      TE.foldW(
        error => {
          return T.fromIO(() => {
            console.log("PING", error)
            setDisplayError(O.some(error))
          })
        },
        res => {
          const utcOffsetSec = new Date(now()).getTimezoneOffset() * 60
          const sunData_ = toSunData(res, utcOffsetSec)
          return T.fromIO(() => setSunData(O.some(sunData_)))
        },
      ),
    )()
  },
)

const toDate = (posix: Posix.Posix): string => {
  const date = new Date(posix)
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }
  return new Intl.DateTimeFormat("en-US", options).format(date)
}

const showError = (error: Error): string => {
  return `${error}`
}

type DaySecond = number // number of seconds since localized midnight

const toDaySecond = (posix: Posix.Posix): DaySecond => {
  const n = new Date(posix)
  const hour = n.getHours()
  const minutes = n.getMinutes()
  const seconds = n.getSeconds()

  return hour * 60 * 60 + minutes * 60 + seconds
}

setInterval(() => {
  setNow(Date.now())
}, POLL_INTERVAL)

const App = (): JSX.Element => {
  const nowText = (): string => {
    return F.pipe(now(), now_ => String(now_).slice(0, 10))
  }
  const locationText = (): string =>
    F.pipe(
      location(),
      O.fold(() => "...", showCoord),
    )

  const sunDataText = (): string =>
    F.pipe(
      sunData(),
      O.getOrElse(() => defaultSunData),
      showSunData,
    )

  const siliSet = (): number => {
    const daySecond = toDaySecond(now())
    const { sunriseSec, sunsetSec } = F.pipe(
      sunData(),
      O.getOrElse(() => defaultSunData),
    )

    const siliTime = SiliTime.fromDaySeconds(sunriseSec, sunsetSec)(daySecond)
    return siliTime
  }

  const legsAnHourText = (): string => {
    const { sunriseSec, sunsetSec } = F.pipe(
      sunData(),
      O.getOrElse(() => defaultSunData),
    )

    const legAnHour = 1 / SiliTime.legAnHour(sunriseSec, sunsetSec)
    return String(legAnHour).slice(0, 4)
  }

  const negsAnHourText = (): string => {
    const { sunriseSec, sunsetSec } = F.pipe(
      sunData(),
      O.getOrElse(() => defaultSunData),
    )

    const negAnHour = 1 / SiliTime.negAnHour(sunriseSec, sunsetSec)
    return String(negAnHour).slice(0, 4)
  }

  const siliTimeText = (): string => {
    const siliTime = SiliTime.fromSet(siliSet())
    return SiliTime.show(siliTime)
  }

  const displayErrorText = (): string =>
    F.pipe(
      displayError(),
      O.fold(() => "", showError),
    )

  const hasError = (): boolean =>
    F.pipe(displayError(), O.map(F.constTrue), O.getOrElse(F.constFalse))

  return (
    <div class="p-8 space-y-4">
      <h1 class="text-2xl font-bold mb-2">SILI TIME • {siliTimeText()}</h1>
      {hasError() && <p>{displayErrorText()}</p>}
      <div>
        <p>Date Time • {toDate(now())}</p>
      </div>

      <p>Posix: {nowText()}</p>

      <div>
        <h2>Location</h2>
        <p>{locationText()}</p>
        <p>{sunDataText()}</p>
      </div>

      <div>
        <p>hours in a Leg: {legsAnHourText()}</p>
        <p>hours in a Neg: {negsAnHourText()}</p>
      </div>
    </div>
  )
}

F.pipe(
  document.getElementById("app"),
  O.fromNullable,
  O.fold(
    () => {},
    r => render(() => <App />, r),
  ),
)
