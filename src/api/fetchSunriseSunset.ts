import {
  DaySeconds,
  DayTime,
  GeolocationCoordinates,
  SunriseSunset,
} from "@app/model"

import { ParseResult, Schema as S } from "@effect/schema"
import { Effect, pipe } from "effect"

const SUNRISE_SUNSET_API = "https://api.sunrise-sunset.org/json"

// APIDayTimeString
//
// 9:31:24 AM, 11:27:01 PM, etc
// in UTC

export type APIDayTime = string

type APISunResponse = {
  readonly status: "OK"
  readonly results: {
    readonly sunrise: APIDayTime
    readonly sunset: APIDayTime
    readonly solar_noon: APIDayTime
    readonly day_length: APIDayTime
    readonly civil_twilight_begin: APIDayTime
    readonly civil_twilight_end: APIDayTime
    readonly nautical_twilight_begin: APIDayTime
    readonly nautical_twilight_end: APIDayTime
    readonly astronomical_twilight_begin: APIDayTime
    readonly astronomical_twilight_end: APIDayTime
  }
}

const APISunResponse: S.Schema<APISunResponse, APISunResponse> = S.struct({
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

const mod =
  (n: number) =>
  (d: number): number => {
    return ((n % d) + d) % d
  }

type UTCOffset = DaySeconds.DaySeconds
const secondsInADay = 24 * 60 * 60

const toModel = (api: APISunResponse): SunriseSunset.SunriseSunset => {
  const utcOffset = 1
  const {
    results: { sunrise, sunset },
  } = api

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

export const fetchSunriseSunset = ({
  latitude,
  longitude,
}: GeolocationCoordinates.GeolocationCoordinates): Effect.Effect<
  never,
  Error | ParseResult.ParseError,
  SunriseSunset.SunriseSunset
> => {
  const url = new URL(SUNRISE_SUNSET_API)
  url.searchParams.set("lat", String(latitude))
  url.searchParams.set("lng", String(longitude))
  url.searchParams.set("formatted", String(1))

  return pipe(
    Effect.tryPromise({
      try: async () => {
        const result = await fetch(url, {
          method: "GET",
        })
        const data = (await result.json()) as unknown
        console.log("got sunriseSunset data:", data)
        return data
      },
      catch: reason => new Error(`${reason}`),
    }),
    Effect.flatMap(rawData => S.parse(APISunResponse)(rawData)),
    Effect.map(toModel),
  )
}
