import { S } from "./fpts"

type Seconds = number

// DayTime
// hours and minutes and seconds since localized midnight in latin numeric

export type DayTime = {
  hour: number
  minute: number
  second: Seconds
}

export const show = (dayTime: DayTime): string => {
  const { hour, minute, second } = dayTime
  return `${hour}:${minute}:${second}`
}

export const fromSeconds = (seconds: Seconds): DayTime => {
  const hour = Math.floor(seconds / (60 * 60))
  const minute = Math.floor((seconds - hour * 60 * 60) / 60)
  const second: Seconds = seconds - hour * 60 * 60 - minute * 60
  return {
    hour,
    minute,
    second,
  }
}

export type TimeString = string // 9:31:24 AM, 11:27:01 PM, etc
export const timeStringToSeconds = (timeString: TimeString): Seconds => {
  const regex = new RegExp(/:| /)
  const [hour, minute, second, meridian] = S.split(regex)(timeString)
  console.log(
    `hour ${hour}, minute: ${minute}, second: ${second}, meridian: ${meridian}`,
  )
  const hNum = Number(hour) * 60 * 60
  const mNum = Number(minute) * 60
  const sNum = Number(second)
  const merNum = meridian === "PM" ? 12 * 60 * 60 : 0
  return hNum + mNum + sNum + merNum
}
