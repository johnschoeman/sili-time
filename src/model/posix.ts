import * as DaySeconds from "./daySeconds"

// Posix
//
// number of milliseconds since 1970-01-01T00:00:00Z

export type Posix = number

export const toDaySecond = (posix: Posix): DaySeconds.DaySeconds => {
  const n = new Date(posix)
  const hour = n.getHours()
  const minutes = n.getMinutes()
  const seconds = n.getSeconds()

  return hour * 60 * 60 + minutes * 60 + seconds
}

export const toDate = (posix: Posix): string => {
  const date = new Date(posix)
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }
  return new Intl.DateTimeFormat("en-US", options).format(date)
}
