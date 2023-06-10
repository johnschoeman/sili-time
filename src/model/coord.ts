type Lat = number
type Lng = number
export type Coord = [Lat, Lng]

export const show = (coord: Coord): string => {
  const [lat, lng] = coord
  const latText = String(lat).slice(0, 7)
  const lngText = String(lng).slice(0, 7)
  return `Lat: ${latText} Lng: ${lngText}`
}
