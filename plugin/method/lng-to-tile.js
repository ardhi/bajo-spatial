// source: https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29

export default function (lng, zoom) {
  return (Math.floor((lng + 180) / 360 * Math.pow(2, zoom)))
}
