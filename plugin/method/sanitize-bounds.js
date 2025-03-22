export default function (bounds) {
  if (typeof bounds === 'string') {
    bounds = bounds.trim()
    if (bounds.substr(0, 1) === '[') {
      try {
        bounds = JSON.parse(bounds)
      } catch (err) {}
    } else {
      bounds = bounds.split(',')
    }
    bounds = bounds.map(val => parseFloat(val))
  }
  return bounds
}
