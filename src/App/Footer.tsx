import { Accessor, JSX } from "solid-js"
import { pipe, Option } from "effect"

import { Coord, Posix, SiliTime, SunData } from "@app/model"

const nowText = (now: Accessor<Posix.Posix>): string => {
  return pipe(now(), now_ => String(now_).slice(0, 10))
}

const legsAnHourText = (sunData_: SunData.SunData): string => {
  const legAnHour = 1 / SiliTime.legAnHour(sunData_)
  return String(legAnHour).slice(0, 4)
}
const negsAnHourText = (sunData_: SunData.SunData): string => {
  const negAnHour = 1 / SiliTime.negAnHour(sunData_)
  return String(negAnHour).slice(0, 4)
}

type FooterProps = {
  now: Accessor<Posix.Posix>
  location: Accessor<Option.Option<Coord.Coord>>
  sunData: SunData.SunData
}
const Footer = ({ now, location, sunData }: FooterProps): JSX.Element => {
  return (
    <div class="p-4 w-full border-t border-gray-400">
    <div class="grid gap-y-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">

      <div>
        <label>train time</label>
        <p class="font-semibold">{Posix.toDate(now())}</p>
      </div>

      <div>
        <label>epoch</label>
        <p class="font-semibold">{nowText(now)}</p>
      </div>

      {pipe(
        location(),
        Option.match({
          onNone: () => "...",
          onSome: ([lat, lng]) => {
            return (
              <>
                <div class="">
                  <label>Latitude</label>
                  <p class="font-semibold">{lat}</p>
                </div>
                <div class="">
                  <label>Longitude</label>
                  <p class="font-semibold">{lng}</p>
                </div>
              </>
            )
          },
        }),
      )}

      <div>
        <label>Sunrise (train)</label>
        <p class="font-semibold">{SunData.showSunrise(sunData)}</p>
      </div>

      <div>
        <label>Sunset (train)</label>
        <p class="font-semibold">{SunData.showSunset(sunData)}</p>
      </div>

      <div>
        <label>Hours / Leg</label>
        <p class="font-semibold">{legsAnHourText(sunData)}</p>
      </div>

      <div>
        <label>Hours / Neg</label>
        <p class="font-semibold">{negsAnHourText(sunData)}</p>
      </div>


      </div>
    </div>
  )
}

export default Footer
