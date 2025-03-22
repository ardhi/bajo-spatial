export default function (lng, lat) {
  if ([null, undefined].includes(lng) || [null, undefined].includes(lat)) return false
  if (isNaN(lng) || isNaN(lat)) return false
  return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90
}
