import { Coord, DayTime, SunData } from "@app/model"

// import {
//   HttpClient,
//   HttpClientError,
//   HttpClientRequest,
//   HttpClientResponse,
//   Headers,
// } from "@effect/platform"
import * as Schema from "@effect/schema/Schema"
import { Effect } from "effect"

const SUNRISE_SUNSET_API = "https://api.sunrise-sunset.org/json"

const SunResponse = Schema.Struct({
  status: Schema.Literal("OK"),
  results: Schema.Struct({
    sunrise: Schema.String,
    sunset: Schema.String,
    solar_noon: Schema.String,
    day_length: Schema.String,
    civil_twilight_begin: Schema.String,
    civil_twilight_end: Schema.String,
    nautical_twilight_begin: Schema.String,
    nautical_twilight_end: Schema.String,
    astronomical_twilight_begin: Schema.String,
    astronomical_twilight_end: Schema.String,
  }),
})

// TimeStrings are in UTC
type SunResponse = Schema.Schema.Type<typeof SunResponse>

type UTCOffset = SunData.Seconds

const utcOffsetSec = new Date().getTimezoneOffset() * 60

const secondsInADay = 24 * 60 * 60
export const toModel =
  (utcOffset: UTCOffset) =>
  (sunResponse: SunResponse): SunData.SunData => {
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

export const fetchSunriseSunset = (
  coords: Coord.Coord,
): Effect.Effect<SunData.SunData, Error> => {
  const [lat, lng] = coords
  const url = new URL(SUNRISE_SUNSET_API)
  url.searchParams.set("lat", String(lat))
  url.searchParams.set("lng", String(lng))
  url.searchParams.set("formatted", String(1))

  // const result = HttpClientRequest.get(url).pipe(
  //   HttpClient.fetchOk,
  //   HttpClientResponse.json,
  //   Effect.map(Schema.decodeUnknownSync(SunResponse)),
  //   Effect.map(toModel(utcOffsetSec)),
  // )

  const result = Effect.tryPromise(async () => {
    return fetch(url).then(async res => res.json())
  }).pipe(
    Effect.map(Schema.decodeUnknownSync(SunResponse)),
    Effect.map(toModel(utcOffsetSec)),
  )

  return result
}
