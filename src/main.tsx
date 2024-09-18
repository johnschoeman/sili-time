import App from "./App"
import { JSX } from "solid-js"

import "./index.css"

import { Option, pipe } from "effect"
import { render } from "solid-js/web"
import { RouteDefinition, Router } from "@solidjs/router"

const About = (): JSX.Element => {
  return <h1>about</h1>
}

const routes: RouteDefinition[] = [
  {
    path: "/",
    component: App,
  },
  {
    path: "/about",
    component: About,
  },
]

pipe(
  document.getElementById("app"),
  Option.fromNullable,
  Option.match({
    onNone: () => {
      throw new Error("Unable to find root div")
    },
    onSome: r => render(() => <Router>{routes}</Router>, r),
  }),
)
