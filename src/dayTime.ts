import { S } from "./fpts"

// DaySeconds
// number of seconds since localized midnight

export type DaySeconds = number

// DayTime
// hours and minutes and seconds since localized midnight in latin numeric

export type DayTime = {
  hour: number // 0 - 23
  minute: number // 0 - 59
  second: DaySeconds // 0 - 59
}

export const show = (dayTime: DayTime): string => {
  const { hour, minute, second } = dayTime
  return `${hour}:${minute}:${second}`
}

export const fromSeconds = (seconds: DaySeconds): DayTime => {
  const hour = Math.floor(seconds / (60 * 60))
  const minute = Math.floor((seconds - hour * 60 * 60) / 60)
  const second: DaySeconds = seconds - hour * 60 * 60 - minute * 60
  return {
    hour,
    minute,
    second,
  }
}

export const toSeconds = ({ hour, minute, second }: DayTime): DaySeconds => {
  const hNum = Number(hour) * 60 * 60
  const mNum = Number(minute) * 60
  const sNum = Number(second)
  return hNum + mNum + sNum
}

export type DayTimeString = string // 9:31:24 AM, 11:27:01 PM, etc
export const dayTimeStringToSeconds = (
  timeString: DayTimeString,
): DaySeconds => {
  const regex = new RegExp(/:| /)
  const [hour, minute, second, meridian] = S.split(regex)(timeString)

  const milHour = militaryHour(meridian as Meridian, hour as DayHour)

  const hNum = Number(milHour) * 60 * 60
  const mNum = Number(minute) * 60
  const sNum = Number(second)

  const result = hNum + mNum + sNum

  return result
}

type MilitaryHour =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"

type DayHour =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
type Meridian = "AM" | "PM"

const militaryHour = (meridian: "AM" | "PM", hour: DayHour): MilitaryHour => {
  switch (meridian) {
    case "AM": {
      switch (hour) {
        case "12":
          return "0"
        default:
          return hour
      }
    }
    case "PM":
      switch (hour) {
        case "12":
          return "12"
        default:
          return String(Number(hour) + 12) as MilitaryHour
      }
  }
}
