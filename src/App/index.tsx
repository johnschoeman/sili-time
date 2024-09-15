import cn from "classnames"
import { JSX } from "solid-js"

import { LocationState, NowState, ThemeState } from "@app/state"

import Footer from "./Footer"
import Header from "./Header"
import SiliTimeView from "./SiliTime"

void NowState.startNowInterval()
void LocationState.getLocation()

const App = (): JSX.Element => {
  return (
    <div
      class={cn(
        "font-sans bkg-white txt-gray-900 space-y-4 h-screen flex flex-col justify-between",
        ThemeState.getStyle(),
      )}
    >
      <Header />
      <SiliTimeView />
      <Footer />
    </div>
  )
}

export default App
