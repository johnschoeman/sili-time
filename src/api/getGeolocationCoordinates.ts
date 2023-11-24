import { GeolocationCoordinates } from "@app/model"

import { Effect } from "effect"

type APIGeolocationCoordinates = {
  latitude: number
  longitude: number
  altitude: number | null
  accuracy: number
  altitudeAccuracy: number | null
  heading: number | null
  speed: number | null
}

type APIGeolocationPosition = {
  coords: APIGeolocationCoordinates
  timestamp: number
}

export const getGeolocationCoordinates = Effect.async<
  never,
  GeolocationPositionError | Error,
  GeolocationCoordinates.GeolocationCoordinates
>(resume => {
  console.log("getGeolocationCoordinates")
  if (!navigator.geolocation) {
    return resume(
      Effect.fail(new Error("Geolocation is not supported by your browser")),
    )
  }

  console.log("getGeolocationCoordinates 2")
  navigator.geolocation.getCurrentPosition(
    ({ coords: { latitude, longitude } }: APIGeolocationPosition) => {
      console.log("GeolocationCoordinates:", { latitude, longitude })
      return resume(Effect.succeed({ latitude, longitude }))
    },
    error => {
      console.log("GeolocationCoordinates error", error)
      resume(Effect.fail(error))
    },
    { timeout: 10000 },
  )
})
