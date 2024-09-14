import { fetchSunriseSunset } from "@app/api/sunriseSunset"
import { Coord, Posix, SiliTime, SunData } from "@app/model"

import { Effect, Option, pipe } from "effect"
import { createSignal, JSX } from "solid-js"

const POLL_INTERVAL = 100

const [now, setNow] = createSignal<Posix.Posix>(Date.now())
const [locationPermission, setLocationPermission] = createSignal<
  Option.Option<PermissionState>
>(Option.none())
const [location, setLocation] = createSignal<Option.Option<Coord.Coord>>(
  Option.none(),
)
const [sunData, setSunData] = createSignal<Option.Option<SunData.SunData>>(
  Option.none(),
)
const [displayError, setDisplayError] = createSignal<Option.Option<Error>>(
  Option.none(),
)

// const pemissionStatusTask: T.Task<PermissionStatus> = async () => {
//   try {
//     const state = await navigator.permissions.query({ name: "geolocation" })
//     return state
//   } catch (err) {
//     return "denied" as unknown as PermissionStatus
//   }
// }

//  setLocationPermission(O.some(result.state))
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
// })

const report = (state: string): void => {
  console.log(`Permission ${state}`)
}

const getLocation = async (): Promise<void> => {
  navigator.geolocation.getCurrentPosition(
    async ({ coords: { latitude, longitude } }) => {
      const coord: Coord.Coord = [latitude, longitude]

      setLocation(() => {
        return Option.some(coord)
      })

      const getSunData = pipe(
        coord,
        fetchSunriseSunset,
        Effect.match({
          onFailure: error => {
            console.log("PING", error)
            setDisplayError(Option.some(error))
          },
          onSuccess: sunData_ => {
            console.log(sunData_)
            setSunData(Option.some(sunData_))
          },
        }),
      )

      void Effect.runPromise(getSunData)
    },
  )
}

//void handlePermission()
void getLocation()

const showError = (error: Error): string => {
  return `${error}`
}

setInterval(() => {
  setNow(Date.now())
}, POLL_INTERVAL)

const nowText = (): string => {
  return pipe(now(), now_ => String(now_).slice(0, 10))
}
const locationText = (): string =>
  pipe(location(), Option.match({ onNone: () => "...", onSome: Coord.show }))

const legsAnHourText = (sunData_: SunData.SunData): string => {
  const legAnHour = 1 / SiliTime.legAnHour(sunData_)
  return String(legAnHour).slice(0, 4)
}

const negsAnHourText = (sunData_: SunData.SunData): string => {
  const negAnHour = 1 / SiliTime.negAnHour(sunData_)
  return String(negAnHour).slice(0, 4)
}

const siliTime = (sunData_: SunData.SunData): SiliTime.SiliTime => {
  return pipe(
    now(),
    Posix.toDaySecond,
    SiliTime.fromDaySeconds(sunData_),
    SiliTime.fromSet,
  )
}

const siliTimeText = (sunData_: SunData.SunData): string => {
  return pipe(sunData_, siliTime, SiliTime.show)
}

const percentCompletedText = (sunData_: SunData.SunData): string => {
  return pipe(
    sunData_,
    siliTime,
    SiliTime.percentCompleted,
    c => String(c * 100).slice(0, 4),
    v => `${v}%`,
  )
}

const displayErrorText = (): string =>
  pipe(displayError(), Option.match({ onNone: () => "", onSome: showError }))

const hasError = (): boolean =>
  pipe(
    displayError(),
    Option.map(() => true),
    Option.getOrElse(() => false),
  )

type SiliTimeFooProps = SunData.SunData
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
        <p>{SunData.show(sunData_)}</p>
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
      {pipe(
        sunData(),
        Option.match({ onNone: () => <p>Loading</p>, onSome: SiliTimeFoo }),
      )}
      <div>
        <p>Date Time • {Posix.toDate(now())}</p>
      </div>
      <p>Posix: {nowText()}</p>
    </div>
  )
}

export default App
