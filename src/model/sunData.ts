import * as DayTime from "./dayTime"

export type SunData = {
  sunriseSec: Seconds
  sunsetSec: Seconds
}

export type Seconds = number

export const show = (sunData: SunData): string => {
  const { sunriseSec, sunsetSec } = sunData
  const sunriseDayTime = DayTime.fromSeconds(sunriseSec)
  const sunsetDayTime = DayTime.fromSeconds(sunsetSec)
  return `sunrise: ${DayTime.show(sunriseDayTime)} sunset: ${DayTime.show(
    sunsetDayTime,
  )}`
}
