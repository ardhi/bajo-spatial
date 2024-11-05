import lngToTile from './lngToTile.js'
import latToTile from './latToTile.js'

export default function (bounds, zoom, allTiles, withZ) {
  const x1 = lngToTile(bounds[0], zoom)
  const y1 = latToTile(bounds[1], zoom)
  const x2 = lngToTile(bounds[2], zoom)
  const y2 = latToTile(bounds[3], zoom)
  if (allTiles) {
    const all = []
    for (let i = x1; i <= x2; i++) {
      for (let j = y2; j <= y1; j++) {
        let item
        switch (allTiles) {
          case 'array':
            item = [i, j]
            if (withZ) item.unshift(zoom)
            break
          case 'object':
            item = { x: i, y: j }
            if (withZ) item.zoom = zoom
            break
          default: item = `${withZ ? (zoom + '/') : ''}${i}/${j}`
        }
        all.push(item)
      }
    }
    return all
  }
  return [x1, y1, x2, y2]
}
