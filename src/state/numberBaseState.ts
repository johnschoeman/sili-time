import { NumberBase } from "@app/model"

import { pipe } from "effect"
import { createSignal } from "solid-js"

export const [numberBase, setNumberBase] =
  createSignal<NumberBase.NumberBase>("Decimal")

export const toggle = (): void => {
  pipe(numberBase(), NumberBase.toggle, setNumberBase)
}
