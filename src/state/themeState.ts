import { Theme } from "@app/model"

import { pipe } from "effect"
import { createSignal } from "solid-js"

const determineSystemTheme = (): Theme.Theme => {
  if (!window.matchMedia) {
    return "Light"
  }

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "Dark"
  } else {
    return "Light"
  }
}

const initialState = determineSystemTheme()

export const [theme, setTheme] = createSignal<Theme.Theme>(initialState)

export const toggle = (): void => {
  pipe(theme(), Theme.toggle, setTheme)
}

export const getStyle = (): string => {
  return pipe(theme(), Theme.toStyle)
}
