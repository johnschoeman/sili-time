import { RemoteData, SunData } from "@app/model"

import { createSignal } from "solid-js"

type SunDataState = RemoteData.RemoteData<SunData.SunData, Error>

const initialValue: SunDataState = RemoteData.NotStarted()

export const [sunData, setSunData] = createSignal<SunDataState>(initialValue)
