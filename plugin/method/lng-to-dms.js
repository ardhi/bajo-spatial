import ddToDms from './dd-to-dms.js'

export default function (val, secPrecision) {
  const dms = ddToDms(val, secPrecision)
  if (dms.substr(0, 1) === '-') return dms.substr(1) + ' W'
  return dms + ' E'
}
