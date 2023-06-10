export type Posix = number

type DaySecond = number // number of seconds since localized midnight

export const toDaySecond = (posix: Posix): DaySecond => {
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
