async function getCountryBbox (item) {
  item = item + ''
  if (item.includes(',')) return
  if (!this.app.bajoCommonDb || !this.app.dobo) return
  const { recordGet } = this.app.dobo
  const country = await recordGet('CdbCountry', item, { thrownNotFound: false })
  if (country) return country.bbox
  throw this.error('Invalid country bbox \'%s\'', item, { statusCode: 400 })
}

async function parseBbox (input) {
  const { isSet } = this.app.bajo
  if (input.length === 2 && !input.includes(',')) return await getCountryBbox.call(this, input)
  const [minx, miny, maxx, maxy] = input.split(',').map(b => parseFloat(b) || null)
  const valid = (isSet(minx) && isSet(miny) && isSet(maxx) && isSet(maxy)) &&
    (minx >= -180 && maxx <= 180 && miny >= -90 && maxy <= 90)
    // (minx <= maxx && miny <= maxy)
  if (valid) return [minx, miny, maxx, maxy]
  throw this.error('Invalid bbox \'%s\'', input)
}

export default parseBbox
