type Latitude = number
type Longitude = number

export type GeolocationCoordinates = {
  latitude: Latitude
  longitude: Longitude
}

export const show = ({
  latitude,
  longitude,
}: GeolocationCoordinates): string => {
  const latText = String(latitude).slice(0, 7)
  const lngText = String(longitude).slice(0, 7)
  return `Lat: ${latText} Lng: ${lngText}`
}
