import * as DayTime from './dayTime'

// DaySeconds
//
// number of seconds since localized midnight

export type DaySeconds = number

export const toDayTime = (seconds: DaySeconds): DayTime.DayTime => {
  const hour = Math.floor(seconds / (60 * 60))
  const minute = Math.floor((seconds - hour * 60 * 60) / 60)
  const second: DaySeconds = seconds - hour * 60 * 60 - minute * 60

  return {
    hour,
    minute,
    second,
  }
}
