import * as DayTime from "./dayTime"
import * as SunData from "./sunData"

import { Array, pipe } from "effect"

type Sight = "Light" | "Night"
type Seg = number
type Segen = number
type Seget = number

export type SiliTime = {
  sight: Sight
  seg: Seg
  segen: Segen
  seget: Seget
}

type SiliSet = number

const sunriseSSec = 0
const sunsetSSet = 12 * 60 * 60
const secondsInADay = 24 * 60 * 60
const secondsInAHalfDay = 12 * 60 * 60

const lightDurationSSet = sunsetSSet - sunriseSSec
const nightDurationSSet = secondsInADay - lightDurationSSet

export const fromDaySeconds =
  ({ sunriseSec: sunriseDSec, sunsetSec: sunsetDSec }: SunData.SunData) =>
  (daySec: DayTime.DaySeconds): SiliSet => {
    const lightDurationDSec = sunsetDSec - sunriseDSec
    const nightDurationDSec = secondsInADay - lightDurationDSec

    const ratioL = lightDurationSSet / lightDurationDSec
    const ratioN = nightDurationSSet / nightDurationDSec

    let siliSet
    const isLight = daySec >= sunriseDSec && daySec < sunsetDSec

    if (isLight) {
      const secondsSinceDawn = daySec - sunriseDSec
      const legetsSinceDawn = Math.floor(secondsSinceDawn * ratioL)
      siliSet = legetsSinceDawn
    } else {
      const secondsSinceDusk =
        (daySec - sunsetDSec + secondsInADay) % secondsInADay
      const negetsSinceDusk = Math.floor(secondsSinceDusk * ratioN)

      siliSet = negetsSinceDusk + secondsInAHalfDay
    }

    return siliSet
  }

export const toSet = (siliTime: SiliTime): SiliSet => {
  const { sight, seg, segen, seget } = siliTime

  const sightSec = sight === "Light" ? 0 : secondsInAHalfDay
  return sightSec + seg * 60 * 60 + segen * 60 + seget
}

export const fromSet = (set: SiliSet): SiliTime => {
  const fullSeg: Seg = Math.floor(set / (60 * 60))
  const segen: Segen = Math.floor((set - fullSeg * 60 * 60) / 60)
  const seget: Seget = set - fullSeg * 60 * 60 - segen * 60

  const sight: Sight = fullSeg < 12 ? "Light" : "Night"
  const seg = fullSeg % 12

  const result = { sight, seg, segen, seget }

  return result
}

const showSight = (sight: Sight): string => {
  switch (sight) {
    case "Night":
      return "N"
    case "Light":
      return "L"
  }
}

export const show = (siliTime: SiliTime): string => {
  const { sight, seg, segen, seget } = siliTime
  return pipe(
    [seg, segen, seget],
    Array.map(pad),
    Array.prepend(showSight(sight)),
    Array.join(":"),
  )
}

const pad = (v: number): string => {
  return String(v).padStart(2, "0")
}

export const legAnHour = ({
  sunriseSec,
  sunsetSec,
}: SunData.SunData): number => {
  const lightDurationDSec = sunsetSec - sunriseSec
  const ratioL = lightDurationSSet / lightDurationDSec
  return ratioL
}

export const negAnHour = ({
  sunriseSec,
  sunsetSec,
}: SunData.SunData): number => {
  const lightDurationDSec = sunsetSec - sunriseSec
  const nightDurationDSec = secondsInADay - lightDurationDSec

  const ratioN = nightDurationSSet / nightDurationDSec

  return ratioN
}

const mod =
  (n: number) =>
  (d: number): number => {
    return ((n % d) + d) % d
  }

export const percentCompleted = (siliTime: SiliTime): number => {
  const set = mod(toSet(siliTime))(secondsInAHalfDay)
  return set / secondsInAHalfDay
}
