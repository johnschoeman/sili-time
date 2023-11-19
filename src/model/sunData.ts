import * as Coord from "./coord"
import * as DayTime from "./dayTime"

import { ParseResult, Schema as S } from "@effect/schema"
import { Effect, pipe } from "effect"

const SUNRISE_SUNSET_API = "https://api.sunrise-sunset.org/json"

export type SunData = {
  sunriseSec: Seconds
  sunsetSec: Seconds
}

type Seconds = number
type UTCOffset = Seconds

// TimeStrings are in UTC
type SunResponse = {
  readonly status: "OK"
  readonly results: {
    readonly sunrise: DayTime.DayTimeString
    readonly sunset: DayTime.DayTimeString
    readonly solar_noon: DayTime.DayTimeString
    readonly day_length: DayTime.DayTimeString
    readonly civil_twilight_begin: DayTime.DayTimeString
    readonly civil_twilight_end: DayTime.DayTimeString
    readonly nautical_twilight_begin: DayTime.DayTimeString
    readonly nautical_twilight_end: DayTime.DayTimeString
    readonly astronomical_twilight_begin: DayTime.DayTimeString
    readonly astronomical_twilight_end: DayTime.DayTimeString
  }
}

const secondsInADay = 24 * 60 * 60
export const toSunData = (
  sunResponse: SunResponse,
  utcOffset: UTCOffset,
): SunData => {
  const {
    results: { civil_twilight_begin: sunrise, civil_twilight_end: sunset },
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

const sunResponseDecoder: S.Schema<SunResponse, SunResponse> = S.struct({
  status: S.literal("OK"),
  results: S.struct({
    sunrise: S.string,
    sunset: S.string,
    solar_noon: S.string,
    day_length: S.string,
    civil_twilight_begin: S.string,
    civil_twilight_end: S.string,
    nautical_twilight_begin: S.string,
    nautical_twilight_end: S.string,
    astronomical_twilight_begin: S.string,
    astronomical_twilight_end: S.string,
  }),
})

export const fetchSunriseSunset = (
  coords: Coord.Coord,
): Effect.Effect<never, Error | ParseResult.ParseError, SunResponse> => {
  const [lat, lng] = coords
  const url = new URL(SUNRISE_SUNSET_API)
  url.searchParams.set("lat", String(lat))
  url.searchParams.set("lng", String(lng))
  url.searchParams.set("formatted", String(1))

  return pipe(
    Effect.tryPromise({
      try: async () => {
        const result = await fetch(url, {
          method: "GET",
        })
        const data = (await result.json()) as unknown
        return data
      },
      catch: reason => new Error(`${reason}`),
    }),
    Effect.flatMap(rawData => S.parse(sunResponseDecoder)(rawData)),
  )
}
