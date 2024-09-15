import { LocationState, NowState, ThemeState } from "@app/state"

import Footer from "./Footer"
import Header from "./Header"
import SiliTimeView from "./SiliTime"

import { JSX } from "solid-js"

// const [locationPermission, setLocationPermission] = createSignal<
// Option.Option<PermissionState>
// >(Option.none())

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

//void handlePermission()

void NowState.startNowInterval()
void LocationState.getLocation()

const App = (): JSX.Element => {
  return (
    <div class={ThemeState.getStyle()}>
      <div class="font-sans bkg-white txt-gray-900 space-y-4 h-screen flex flex-col justify-between">
        <Header />

        <SiliTimeView />

        <Footer />
      </div>
    </div>
  )
}

export default App
