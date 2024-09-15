import { SunData } from "@app/model"

import { Option } from "effect"
import { createSignal } from "solid-js"

type SunDataState = Option.Option<SunData.SunData>

const initialValue = Option.none()

export const [sunData, setSunData] = createSignal<SunDataState>(initialValue)
