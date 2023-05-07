import { fromSeconds } from "./dayTime"

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
