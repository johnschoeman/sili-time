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

export const getGeolocation = Effect.async<
  never,
  GeolocationPositionError | Error,
  GeolocationCoordinates.GeolocationCoordinates
>(resume => {
  if (!navigator.geolocation) {
    return resume(
      Effect.fail(new Error("Geolocation is not supported by your browser")),
    )
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords: { latitude, longitude } }: APIGeolocationPosition) => {
      return resume(Effect.succeed({ latitude, longitude }))
    },
    error => resume(Effect.fail(error)),
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    },
  )
})
