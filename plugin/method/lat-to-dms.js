import ddToDms from './dd-to-dms.js'

export default function (val, secPrecision) {
  const dms = ddToDms(val, secPrecision)
  if (dms.slice(0, 1) === '-') return dms.slice(1) + ' S'
  return dms + ' N'
}
