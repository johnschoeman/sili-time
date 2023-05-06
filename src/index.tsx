import { E, F, O, T, TE } from "./fpts"

import * as D from "io-ts/Decoder"
import { failure } from "io-ts/lib/PathReporter"
import type { JSX } from "solid-js"
import { createEffect, createSignal } from "solid-js"
import { render } from "solid-js/web"

const SUNRISE_SUNSET_API = "https://api.sunrise-sunset.org/json"

type Posix = number
type Lat = number
type Lng = number
type Coord = [Lat, Lng]

const showCoord = (coord: Coord): string => {
  const [lat, lng] = coord
  return `Lat: ${lat} Lng: ${lng}`
}

type SunResponse = {
  status: "OK"
  results: {
    sunrise: string
    sunset: string
    solar_noon: string
    day_length: string
    civil_twilight_begin: string
    civil_twilight_end: string
    nautical_twilight_begin: string
    nautical_twilight_end: string
    astronomical_twilight_begin: string
    astronomical_twilight_end: string
  }
}

const showSunData = (sunData: SunResponse): string => {
  const {
    results: { sunrise, sunset },
  } = sunData

  return `sunrise: ${sunrise} sunset: ${sunset}`
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

const [now, setNow] = createSignal<Posix>(Date.now())
const [location, setLocation] = createSignal<O.Option<Coord>>(O.none)
const [sunData, setSunData] = createSignal<O.Option<SunResponse>>(O.none)
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
          return T.fromIO(() => setSunData(O.some(res)))
        },
      ),
    )()
  },
)

const toDate = (posix: Posix): string => {
  const date = new Date(posix)
  return date.toString()
}

const showError = (error: Error): string => {
  return `${error}`
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

  const displayErrorText = (): string =>
    F.pipe(
      displayError(),
      O.fold(
        () => "",
        showError
      ),
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
