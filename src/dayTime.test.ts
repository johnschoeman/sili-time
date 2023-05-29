import { dayTimeStringToSeconds, fromSeconds, toSeconds } from "./dayTime"

import { describe, it } from "vitest"

describe("DayTime.fromSeconds", () => {
  describe("When given a number of seconds since midnight", () => {
    it("returns the localized hour minute and seconds of the day", () => {
      const secondsA = 0
      const expectedA = { hour: 0, minute: 0, second: 0 }

      const secondsB = 60
      const expectedB = { hour: 0, minute: 1, second: 0 }

      const secondsC = 3600
      const expectedC = { hour: 1, minute: 0, second: 0 }

      const secondsD = 19372
      const expectedD = { hour: 5, minute: 22, second: 52 }

      const resultA = fromSeconds(secondsA)
      const resultB = fromSeconds(secondsB)
      const resultC = fromSeconds(secondsC)
      const resultD = fromSeconds(secondsD)

      expect(resultA).toStrictEqual(expectedA)
      expect(resultB).toStrictEqual(expectedB)
      expect(resultC).toStrictEqual(expectedC)
      expect(resultD).toStrictEqual(expectedD)
    })
  })
})

describe("DayTime.toSeconds", () => {
  describe("when given a day time", () => {
    it("returns the numbers of seconds since midnight", () => {
      const dayTimeA = { hour: 0, minute: 0, second: 0 }
      const expectedA = 0

      const dayTimeB = { hour: 0, minute: 1, second: 0 }
      const expectedB = 60

      const dayTimeC = { hour: 1, minute: 0, second: 0 }
      const expectedC = 3600

      const dayTimeD = { hour: 5, minute: 22, second: 52 }
      const expectedD = 19372

      const resultA = toSeconds(dayTimeA)
      const resultB = toSeconds(dayTimeB)
      const resultC = toSeconds(dayTimeC)
      const resultD = toSeconds(dayTimeD)

      expect(resultA).toStrictEqual(expectedA)
      expect(resultB).toStrictEqual(expectedB)
      expect(resultC).toStrictEqual(expectedC)
      expect(resultD).toStrictEqual(expectedD)
    })
  })
})

describe("DayTime.dayTimeStringToSeconds", () => {
  describe("when given a day time string", () => {
    it("returns day seconds", () => {
      const dayTimeA = "12:00:00 AM"
      const expectedA = 0

      const dayTimeC = "12:01:00 AM"
      const expectedC = 60

      const dayTimeD = "1:0:00 AM"
      const expectedD = 3600

      const dayTimeB = "12:00:00 PM"
      const expectedB = 43200

      const dayTimeE = "5:29:17 PM"
      const expectedE = 62957

      const dayTimeF = "11:59:59 PM"
      const expectedF = 86399

      const resultA = dayTimeStringToSeconds(dayTimeA)
      const resultB = dayTimeStringToSeconds(dayTimeB)
      const resultC = dayTimeStringToSeconds(dayTimeC)
      const resultD = dayTimeStringToSeconds(dayTimeD)
      const resultE = dayTimeStringToSeconds(dayTimeE)
      const resultF = dayTimeStringToSeconds(dayTimeF)

      expect(resultA).toEqual(expectedA)
      expect(resultB).toEqual(expectedB)
      expect(resultC).toEqual(expectedC)
      expect(resultD).toEqual(expectedD)
      expect(resultE).toEqual(expectedE)
      expect(resultF).toEqual(expectedF)
    })
  })
})
