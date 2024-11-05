import tileToLng from './tileToLng.js'
import tileToLat from './tileToLat.js'

export default function (x1, y1, x2, y2, zoom, extra) {
  const lng1 = tileToLng(x1, zoom)
  const lat1 = tileToLat(y1 + 1, zoom)
  const lng2 = tileToLng(x2 + 1, zoom)
  const lat2 = tileToLat(y2, zoom)
  const ret = [lng1, lat1, lng2, lat2]
  if (!extra) return ret
  return {
    bounds: ret,
    sqd: (lng2 - lng1) * (lat2 - lat1)
  }
}
