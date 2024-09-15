import { createSignal } from "solid-js"

import { Posix } from "@app/model"

const POLL_INTERVAL = 100

export const [now, setNow] = createSignal<Posix.Posix>(Date.now())

export const startNowInterval = (): void => {
  setInterval(() => {
    setNow(Date.now())
  }, POLL_INTERVAL)
}
