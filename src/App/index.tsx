import cn from "classnames"
import { JSX } from "solid-js"
import { Router, Route } from "@solidjs/router"

import { LocationState, NowState, ThemeState } from "@app/state"

import SiliTime from "./SiliTime"
import About from "./About"

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
      <Router>
        <Route path="/" component={SiliTime} />
        <Route path="/about" component={About} />
      </Router>
    </div>
  )
}

export default App
