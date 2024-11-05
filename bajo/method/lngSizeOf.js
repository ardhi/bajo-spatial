export default function (value, lat) {
  return ((value / 40075017) * 360) / Math.cos((Math.PI / 180) * lat)
}
