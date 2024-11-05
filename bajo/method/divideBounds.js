export default function (bounds, count) {
  const originX = bounds[0]
  const originY = bounds[1]
  const dw = (bounds[2] - bounds[0]) / count
  const dh = (bounds[3] - bounds[1]) / count
  const result = []
  for (let y = count - 1; y >= 0; y--) {
    for (let x = 0; x < count; x++) {
      const x1 = originX + x * dw
      const y1 = originY + y * dh
      const x2 = x1 + dw
      const y2 = y1 + dh
      result.push([x1, y1, x2, y2])
    }
  }
  return result
}
