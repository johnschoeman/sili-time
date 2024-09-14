import App from "./App"

import "./index.css"

import { Option, pipe } from "effect"
import { render } from "solid-js/web"

pipe(
  document.getElementById("app"),
  Option.fromNullable,
  Option.match({
    onNone: () => {},
    onSome: r => render(() => <App />, r),
  }),
)
