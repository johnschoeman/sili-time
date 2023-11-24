import * as API from "@app/api"
import {
  GeolocationCoordinates,
  Posix,
  SiliTime,
  SunriseSunset,
} from "@app/model"

import { ParseResult } from "@effect/schema"
import { Effect, Option, pipe } from "effect"
import { createSignal, JSX } from "solid-js"

const POLL_INTERVAL = 100

const [now, setNow] = createSignal<Posix.Posix>(Date.now())
// const [locationPermission, setLocationPermission] = createSignal< Option.Option<PermissionState> >(Option.none())
const [geolocationCoordinates, setGeolocationCoordinates] = createSignal<
  Option.Option<GeolocationCoordinates.GeolocationCoordinates>
>(Option.none())
const [sunriseSunset, setSunriseSunset] = createSignal<
  Option.Option<SunriseSunset.SunriseSunset>
>(Option.none())
const [displayError, setDisplayError] = createSignal<
  Option.Option<Error | ParseResult.ParseError>
>(Option.none())

//const _pemissionStatusTask = async (): Promise<PermissionStatus> => {
// try {
//   const state = await navigator.permissions.query({ name: "geolocation" })
//   return state
// } catch (err) {
//   return "denied" as unknown as PermissionStatus
// }
//}

//void _pemissionStatusTask().then(result => {
// console.log("Permission", result)
//})

//  setLocationPermission(Option.some(result.state))
//  switch (result.state) {
//    case "granted":
//    case "prompt":
//      void getLocation()
//      break
//    case "denied":
//      break
//  }
//  result.addEventListener("change", () => {
//    report(result.state)
//  })
//})

const _report = (state: string): void => {
  console.log(`Permission ${state}`)
}

const showError = (error: Error | ParseResult.ParseError): string => {
  return `${error}`
}

console.log("Start")

void pipe(
  geolocationCoordinates(),
  Option.match({
    onNone: () => Effect.succeed(Option.none()),
    onSome: async geolocationCoordinations => {
      return Effect.runPromise(
        API.fetchSunriseSunset(geolocationCoordinations),
      ).then(setSunriseSunset)
    },
  }),
)

//` Option.match({
//`   onNone: () => Effect.succeed(Option.none()),
//`   onSome: geolocationCoordinations =>
//`     Effect.runPromise(
//`       API.fetchSunriseSunset(geolocationCoordinations),
//`       Effect.match({
//`         onSuccess: sunriseSunset_ => setSunriseSunset(Option.some(sunriseSunset_)),
//`         onFailure: () => {},
//`       }),
//`   )

console.log("End")

setInterval(() => {
  setNow(Date.now())
}, POLL_INTERVAL)

const nowText = (): string => {
  return pipe(now(), now_ => String(now_).slice(0, 10))
}
const locationText = (): string =>
  pipe(
    geolocationCoordinates(),
    Option.match({
      onNone: () => "...",
      onSome: GeolocationCoordinates.show,
    }),
  )

const legsAnHourText = (sunData_: SunriseSunset.SunriseSunset): string => {
  const legAnHour = 1 / SiliTime.legAnHour(sunData_)
  return String(legAnHour).slice(0, 4)
}

const negsAnHourText = (sunData_: SunriseSunset.SunriseSunset): string => {
  const negAnHour = 1 / SiliTime.negAnHour(sunData_)
  return String(negAnHour).slice(0, 4)
}

const siliTime = (sunData_: SunriseSunset.SunriseSunset): SiliTime.SiliTime => {
  return pipe(
    now(),
    Posix.toDaySecond,
    SiliTime.fromDaySeconds(sunData_),
    SiliTime.fromSet,
  )
}

const siliTimeText = (sunData_: SunriseSunset.SunriseSunset): string => {
  return pipe(sunData_, siliTime, SiliTime.show)
}

const percentCompletedText = (
  sunData_: SunriseSunset.SunriseSunset,
): string => {
  return pipe(
    sunData_,
    siliTime,
    SiliTime.percentCompleted,
    c => String(c * 100).slice(0, 4),
    v => `${v}%`,
  )
}

const displayErrorText = (): string =>
  pipe(
    displayError(),
    Option.match({
      onNone: () => "",
      onSome: showError,
    }),
  )

const hasError = (): boolean =>
  pipe(
    displayError(),
    Option.match({
      onNone: () => false,
      onSome: () => true,
    }),
  )

type SiliTimeFooProps = SunriseSunset.SunriseSunset
const SiliTimeFoo = (sunData_: SiliTimeFooProps): JSX.Element => {
  return (
    <>
      <h1 class="text-2xl font-bold mb-2">
        SILI TIME • {siliTimeText(sunData_)} • {percentCompletedText(sunData_)}
      </h1>
      {hasError() && <p>{displayErrorText()}</p>}

      <div>
        <h2>Location</h2>
        <p>{locationText()}</p>
        <p>{SunriseSunset.show(sunData_)}</p>
      </div>

      <div>
        <p>hours in a Leg: {legsAnHourText(sunData_)}</p>
        <p>hours in a Neg: {negsAnHourText(sunData_)}</p>
      </div>
    </>
  )
}

const App = (): JSX.Element => {
  return (
    <div class="p-8 space-y-4">
      <input onChange={e => console.log(e)} />
      <input onChange={e => console.log(e)} />
      {pipe(
        sunriseSunset(),
        Option.match({
          onNone: () => <p>Loading</p>,
          onSome: SiliTimeFoo,
        }),
      )}
      <div>
        <p>Date Time • {Posix.toDate(now())}</p>
      </div>
      <p>Posix: {nowText()}</p>
    </div>
  )
}

export default App
