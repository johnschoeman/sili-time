import * as Posix from "./posix"

type Seg = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

type Meg = number

type SiliTime = {
  seg: Seg
  meg: Meg
  sec: number
}

type DayTime = {
  hour: number,
  minute: number
  second: number
}

export const calculateSiliTime = (now: Posix.Posix, sunrise: DayTime, sunset: DayTime): SiliTime => {
  return {
    seg: 1,
    meg: 1,
    sec: 1
  }
}
