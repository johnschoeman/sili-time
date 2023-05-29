import * as DayTime from "./dayTime"
import { A, F, S } from "./fpts"

type Seg = number
type Segen = number
type Seget = number

type SiliTime = {
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
  (sunriseDSec: DayTime.DaySeconds, sunsetDSec: DayTime.DaySeconds) =>
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
  const { seg, segen, seget } = siliTime

  return seg * 60 * 60 + segen * 60 + seget
}

export const fromSet = (set: SiliSet): SiliTime => {
  const seg: Seg = Math.floor(set / (60 * 60))
  const segen: Segen = Math.floor((set - seg * 60 * 60) / 60)
  const seget: Seget = set - seg * 60 * 60 - segen * 60
  const result = { seg, segen, seget }
  return result
}

export const show = (siliTime: SiliTime): string => {
  const { seg, segen, seget } = siliTime
  return F.pipe([seg, segen, seget], A.map(pad), A.intercalate(S.Monoid)(":"))
}

const pad = (v: number): string => {
  return String(v).padStart(2, "0")
}

export const legAnHour = (
  sunriseDSec: DayTime.DaySeconds,
  sunsetDSec: DayTime.DaySeconds,
): number => {
  const lightDurationDSec = sunsetDSec - sunriseDSec
  const ratioL = lightDurationSSet / lightDurationDSec
  return ratioL
}

export const negAnHour = (
  sunriseDSec: DayTime.DaySeconds,
  sunsetDSec: DayTime.DaySeconds,
): number => {
  const lightDurationDSec = sunsetDSec - sunriseDSec
  const nightDurationDSec = secondsInADay - lightDurationDSec

  const ratioN = nightDurationSSet / nightDurationDSec

  return ratioN
}
