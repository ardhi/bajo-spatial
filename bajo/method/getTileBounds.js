import tileToLng from './tileToLng.js'
import tileToLat from './tileToLat.js'

export default function (x, y, zoom) {
  const lng1 = tileToLng(x, zoom)
  const lat1 = tileToLat(y, zoom)
  const lng2 = tileToLng(x + 1, zoom)
  const lat2 = tileToLat(y + 1, zoom)
  return [lng1, lat2, lng2, lat1]
}
