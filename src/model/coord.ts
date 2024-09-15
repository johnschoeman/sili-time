type Lat = number
type Lng = number
export type Coord = [Lat, Lng]

export const show = (coord: Coord): string => {
  const [lat, lng] = coord
  const latText = String(lat).slice(0, 7)
  const lngText = String(lng).slice(0, 7)
  return `Lat: ${latText} Lng: ${lngText}`
}

export const showLat = (coord: Coord): string => {
  const [lat, _lng] = coord
  const latText = String(lat).slice(0, 7)
  return latText
}

export const showLng = (coord: Coord): string => {
  const [_lat, lng] = coord
  const lngText = String(lng).slice(0, 7)
  return lngText
}
