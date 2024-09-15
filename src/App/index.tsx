import { fetchSunriseSunset } from "@app/api/sunriseSunset"
import { Coord, Posix } from "@app/model"
import { SunDataState, ThemeState } from "@app/state"

import Footer from "./Footer"
import Header from "./Header"
import SiliTimeView from "./SiliTime"

import { Effect, Option, pipe } from "effect"
import { createSignal, JSX } from "solid-js"

const POLL_INTERVAL = 100

const [now, setNow] = createSignal<Posix.Posix>(Date.now())

// const [locationPermission, setLocationPermission] = createSignal<
// Option.Option<PermissionState>
// >(Option.none())
const [location, setLocation] = createSignal<Option.Option<Coord.Coord>>(
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

// const report = (state: string): void => {
//   console.log(`Permission ${state}`)
// }

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
            SunDataState.setSunData(Option.some(sunData_))
          },
        }),
      )

      void Effect.runPromise(getSunData)
    },
  )
}

//void handlePermission()
void getLocation()

setInterval(() => {
  setNow(Date.now())
}, POLL_INTERVAL)

const App = (): JSX.Element => {
  return (
    <div class={ThemeState.getStyle()}>
      <div class="bkg-white txt-gray-900 space-y-4 h-screen flex flex-col justify-between">
        <Header />

        <SiliTimeView now={now} displayError={displayError()} />

        <Footer now={now} location={location} />
      </div>
    </div>
  )
}

export default App
