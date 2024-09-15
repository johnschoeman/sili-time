import { fetchSunriseSunset } from "@app/api/sunriseSunset"
import { Coord } from "@app/model"
import { SunDataState } from "@app/state"

import { Effect, Option,pipe } from "effect"
import { createSignal } from "solid-js"

type LocationState = Option.Option<Coord.Coord>
const initialState: LocationState = Option.none()

export const [location, setLocation] = createSignal<LocationState>(initialState)
export const [displayError, setDisplayError] = createSignal<
  Option.Option<Error>
>(Option.none())

export const getLocation = async (): Promise<void> => {
  navigator.geolocation.getCurrentPosition(
    async ({ coords: { latitude, longitude } }) => {
      const coord: Coord.Coord = [latitude, longitude]
      setLocation(() => {
        return Option.some(coord)
      })
      const getSunData = pipe(
        coord,
        fetchSunriseSunset,
        Effect.match({
          onFailure: error => {
            setDisplayError(Option.some(error))
          },
          onSuccess: sunData_ => {
            SunDataState.setSunData(Option.some(sunData_))
          },
        }),
      )
      void Effect.runPromise(getSunData)
    },
  )
}
