import * as DayTime from "./dayTime"
import * as SiliTime from "./siliTime"

import { describe, it } from "vitest"

// hour   - seg   - leg   - neg
// minute - segen - legen - negen
// second - seget - leget - neget

// seconds in a day     = 24 * 60 * 60 = 86400
// seconds in a halfday = 12 * 60 * 60 = 43200

// Light half of Day  - Light
// Night half of Day  - Night
// Either half of Day - Sight

// 0
// -
// 43200
// -
// 86400 (0)
//
//      DaySecond  DayTime   DaySecondOffset SiliSecond SiliTime
//      0
//      - 2455     -                                    N:06:00:00
// Dawn - 19810    05:30:10  0               0          L:00:00:00
//      43200      12:00:00  23390                      -
//      - 45660    -                         43200      L:06:00:00
// Dusk - 71500    19:51:40  51690                      N:00:00:00
//      86400 (0)  00:00:00  66590                      -
//      - 106210   -                         86400      N:06:00:00

describe("SiliTime.fromDaySeconds", () => {
  describe("when give a sunrise, sunset, and daySecond", () => {
    it("returns the S.I.L.I. time", () => {
      const sunriseSec: DayTime.DaySeconds = DayTime.toSeconds({
        hour: 5,
        minute: 31,
        second: 10,
      })
      const sunsetSec: DayTime.DaySeconds = DayTime.toSeconds({
        hour: 19,
        minute: 51,
        second: 40,
      })
      const sunData = {
        sunriseSec,
        sunsetSec,
      }

      // dawn
      const secondA: DayTime.DaySeconds = DayTime.toSeconds({
        hour: 5,
        minute: 31,
        second: 10,
      })
      const expectedA = SiliTime.toSet({
        sight: "Light",
        seg: 0,
        segen: 0,
        seget: 0,
      })

      // LegMid
      const secondB: DayTime.DaySeconds = DayTime.toSeconds({
        hour: 12,
        minute: 41,
        second: 25,
      })
      const expectedB = SiliTime.toSet({
        sight: "Light",
        seg: 6,
        segen: 0,
        seget: 0,
      })

      // dusk
      const secondC: DayTime.DaySeconds = DayTime.toSeconds({
        hour: 19,
        minute: 51,
        second: 40,
      })
      const expectedC = SiliTime.toSet({
        sight: "Night",
        seg: 0,
        segen: 0,
        seget: 0,
      })

      const secondD: DayTime.DaySeconds = DayTime.toSeconds({
        hour: 20,
        minute: 51,
        second: 41,
      })
      const expectedD = SiliTime.toSet({
        sight: "Night",
        seg: 1,
        segen: 14,
        seget: 34,
      })

      // NegMid
      const secondE: DayTime.DaySeconds = DayTime.toSeconds({
        hour: 0,
        minute: 41,
        second: 25,
      })
      const expectedE = SiliTime.toSet({
        sight: "Night",
        seg: 6,
        segen: 0,
        seget: 0,
      })

      const resultA = SiliTime.fromDaySeconds(sunData)(secondA)
      const resultB = SiliTime.fromDaySeconds(sunData)(secondB)
      const resultC = SiliTime.fromDaySeconds(sunData)(secondC)
      const resultD = SiliTime.fromDaySeconds(sunData)(secondD)
      const resultE = SiliTime.fromDaySeconds(sunData)(secondE)

      expect(resultA).toStrictEqual(expectedA)
      expect(resultB).toStrictEqual(expectedB)
      expect(resultC).toStrictEqual(expectedC)
      expect(SiliTime.fromSet(resultD)).toStrictEqual(
        SiliTime.fromSet(expectedD),
      )
      expect(resultE).toStrictEqual(expectedE)
    })
  })
})
