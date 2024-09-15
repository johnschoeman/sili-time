import * as DayTime from "./dayTime"
import * as NumberBase from "./numberBase"
import * as SunData from "./sunData"

import { Array, pipe } from "effect"

// SILI TIME
// ---------
//
// Seximal Invariant Light Intervals
//
// Divide the day into 12 equal light segments, called Legs.
// Divide the night into 12 equal night segments, called Negs.
//
// Sunrise is 0 Leg (12 Neg)
// Sunset is 0 Neg (12 Leg)
//
// Seg   - Number of 1 / 12s of the day or night
// Segen - 1 / 60th of a Seg
// Seget - 1 / 60th of a Segen

const SEGENS_PER_SEG = 60
const SEGETS_PER_SEGEN = 60
const MINUTES_PER_HOUR = 60
const SECONDS_PER_MINUTE = 60

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

// Number of segets it currently is
type SiliSet = number

const sunriseSSec = 0
const sunsetSSet = 12 * SEGENS_PER_SEG * SEGETS_PER_SEGEN
const secondsInADay = 24 * MINUTES_PER_HOUR * SECONDS_PER_MINUTE
const secondsInAHalfDay = 12 * MINUTES_PER_HOUR * SECONDS_PER_MINUTE

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
  return (
    sightSec +
    seg * SEGENS_PER_SEG * SEGETS_PER_SEGEN +
    segen * SEGETS_PER_SEGEN +
    seget
  )
}

export const fromSet = (set: SiliSet): SiliTime => {
  const fullSeg: Seg = Math.floor(set / (SEGENS_PER_SEG * SEGETS_PER_SEGEN))
  const segen: Segen = Math.floor(
    (set - fullSeg * SEGENS_PER_SEG * SEGETS_PER_SEGEN) / SEGENS_PER_SEG,
  )
  const seget: Seget =
    set - fullSeg * SEGENS_PER_SEG * SEGETS_PER_SEGEN - segen * SEGETS_PER_SEGEN

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

export const show =
  (numberBase: NumberBase.NumberBase) =>
  (siliTime: SiliTime): string => {
    const { sight, seg, segen, seget } = siliTime
    return pipe(
      [seg, segen, seget],
      Array.map(NumberBase.showNumberIn(numberBase)),
      Array.map(pad),
      Array.prepend(showSight(sight)),
      Array.join(":"),
    )
  }

const pad = (v: string): string => {
  return v.padStart(2, "0")
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
