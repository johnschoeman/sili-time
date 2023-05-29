import * as Coord from "./coord"
import * as DayTime from "./dayTime"
import { E, F, TE } from "./fpts"

import * as D from "io-ts/Decoder"

const SUNRISE_SUNSET_API = "https://api.sunrise-sunset.org/json"

export type SunData = {
  sunriseSec: Seconds
  sunsetSec: Seconds
}

type Seconds = number
type UTCOffset = Seconds

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

const secondsInADay = 24 * 60 * 60
export const toSunData = (
  sunResponse: SunResponse,
  utcOffset: UTCOffset,
): SunData => {
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

export const show = (sunData: SunData): string => {
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

export const fetchSunriseSunset = (
  coords: Coord.Coord,
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
