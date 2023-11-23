import * as DaySeconds from "./daySeconds"
import * as DayTime from "./dayTime"

export type SunriseSunset = {
  sunriseSec: DaySeconds.DaySeconds
  sunsetSec: DaySeconds.DaySeconds
}

export const show = ({ sunriseSec, sunsetSec }: SunriseSunset): string => {
  const sunriseDayTime = DaySeconds.toDayTime(sunriseSec)
  const sunsetDayTime = DaySeconds.toDayTime(sunsetSec)

  return `sunrise: ${DayTime.show(sunriseDayTime)} sunset: ${DayTime.show(
    sunsetDayTime,
  )}`
}
