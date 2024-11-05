import tileToLng from './tileToLng.js'
import tileToLat from './tileToLat.js'
import boundsToTiles from './boundsToTiles.js'

export default function (bounds, zoom) {
  const tiles = boundsToTiles(bounds, zoom)
  const lng1 = tileToLng(tiles[0], zoom)
  const lat1 = tileToLat(tiles[1] + 1, zoom)
  const lng2 = tileToLng(tiles[2] + 1, zoom)
  const lat2 = tileToLat(tiles[3], zoom)
  return [lng1, lat1, lng2, lat2]
}
