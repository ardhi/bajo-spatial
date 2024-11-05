import { decimalToSexagesimal } from 'geolib'

export default function (val, secPrecision = 2) {
  val = val + ''
  const minus = val.substr(0, 1) === '-' ? '-' : ''
  const parts = decimalToSexagesimal(val).split(' ')
  const last = parts[parts.length - 1]
  const floats = last.substr(0, last.length - 1).split('.')
  if (floats.length === 1) floats[1] = 0
  floats[1] = parseFloat('0.' + floats[1]).toFixed(secPrecision).split('.')[1]
  parts[parts.length - 1] = floats.join('.') + '"'
  return minus + parts.join(' ')
}
