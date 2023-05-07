import * as DayTime from "./dayTime"
import { E, F, O, T, TE } from "./fpts"
import * as Posix from "./posix"

import "./index.css"

import * as D from "io-ts/Decoder"
import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import { render } from "solid-js/web"

const SUNRISE_SUNSET_API = "https://api.sunrise-sunset.org/json"

type Lat = number
type Lng = number
type Coord = [Lat, Lng]

const showCoord = (coord: Coord): string => {
  const [lat, lng] = coord
  return `Lat: ${lat} Lng: ${lng}`
}

// TimeStrings are in UTC
type SunResponse = {
  status: "OK"
  results: {
    sunrise: DayTime.TimeString
    sunset: DayTime.TimeString
    solar_noon: DayTime.TimeString
    day_length: DayTime.TimeString
    civil_twilight_begin: DayTime.TimeString
    civil_twilight_end: DayTime.TimeString
    nautical_twilight_begin: DayTime.TimeString
    nautical_twilight_end: DayTime.TimeString
    astronomical_twilight_begin: DayTime.TimeString
    astronomical_twilight_end: DayTime.TimeString
  }
}

type Seconds = number
type UTCOffset = Seconds

const toSunData = (sunResponse: SunResponse, utcOffset: UTCOffset): SunData => {
  const {
    results: { sunrise, sunset },
  } = sunResponse

  const sunriseSec = DayTime.timeStringToSeconds(sunrise) - utcOffset
  const sunsetSec = DayTime.timeStringToSeconds(sunset) - utcOffset

  return {
    sunriseSec,
    sunsetSec,
  }
}

type SunData = {
  sunriseSec: Seconds
  sunsetSec: Seconds
}

const showSunData = (sunData: SunData): string => {
  const { sunriseSec, sunsetSec } = sunData
  const sunriseDayTime = DayTime.fromSeconds(sunriseSec)
  const sunsetDayTime = DayTime.fromSeconds(sunsetSec)
  return `sunrise: ${DayTime.show(
    sunriseDayTime,
  )}, ${sunriseSec} sunset: ${DayTime.show(sunsetDayTime)}, ${sunsetSec}`
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
          console.log("SNAKES", res)
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
  return date.toString()
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

    return (hour * 60 * 60) + (minutes * 60) + seconds
}

setInterval(() => {
  setNow(Date.now())
}, 1000)

const App = (): JSX.Element => {
  const locationText = (): string =>
    F.pipe(
      location(),
      O.fold(() => "...", showCoord),
    )

  const sunDataText = (): string =>
    F.pipe(
      sunData(),
      O.fold(() => "...", showSunData),
    )

  const daySecondText = (): string => {
    const daySecond = toDaySecond(now())

    return String(daySecond)
  }

  const displayErrorText = (): string =>
    F.pipe(
      displayError(),
      O.fold(() => "", showError),
    )

  const hasError = (): boolean =>
    F.pipe(displayError(), O.map(F.constTrue), O.getOrElse(F.constFalse))

  return (
    <div class="p-8">
      <h1 class="text-2xl font-bold">SILI TIME</h1>
      {hasError() && <p>{displayErrorText()}</p>}
      <p>Posix: {now()}</p>
      <p>DateTime: {toDate(now())}</p>
      <p>Location: {locationText()}</p>
      <p>SunData: {sunDataText()}</p>
      <p>DaySecond: {daySecondText()}</p>
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
