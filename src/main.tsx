import App from "./App"
import { F, O } from "./fpts"

import "./index.css"

import { render } from "solid-js/web"

F.pipe(
  document.getElementById("app"),
  O.fromNullable,
  O.fold(
    () => {},
    r => render(() => <App />, r),
  ),
)
