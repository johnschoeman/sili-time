import { fetchSunriseSunset } from "@app/api/sunriseSunset"
import { Coord, RemoteData } from "@app/model"
import { SunDataState } from "@app/state"

import { Effect, Option, pipe } from "effect"
import { createSignal } from "solid-js"

type LocationState = RemoteData.RemoteData<
  Coord.Coord,
  GeolocationPositionError
>
const initialState: LocationState = RemoteData.NotStarted()

export const [location, setLocation] = createSignal<LocationState>(initialState)
export const [displayError, setDisplayError] = createSignal<
  Option.Option<Error>
>(Option.none())

export const getLocation = async (): Promise<void> => {
  navigator.geolocation.getCurrentPosition(
    async ({ coords: { latitude, longitude } }) => {
      const coord: Coord.Coord = [latitude, longitude]
      setLocation(() => {
        return RemoteData.Resolved(coord)
      })

      const getSunData = pipe(
        coord,
        fetchSunriseSunset,
        Effect.match({
          onFailure: error => {
            SunDataState.setSunData(RemoteData.RequestError(error))
          },
          onSuccess: sunData_ => {
            SunDataState.setSunData(RemoteData.Resolved(sunData_))
          },
        }),
      )

      void Effect.runPromise(getSunData)
    },
    async error => {
      console.log(error)
      setLocation(RemoteData.RequestError(error))
    },
  )
}
