async function getCountryBbox (item) {
  item = item + ''
  if (item.includes(',')) return
  if (!this.bajoCommonDb || !this.bajoDb) return
  const { error } = this.bajo.helper
  const { recordGet } = this.bajoDb.helper
  const country = await recordGet('CdbCountry', item, { thrownNotFound: false })
  if (country) return country.bbox
  throw error('Invalid country bbox \'%s\'', item, { statusCode: 400 })
}

async function parseBbox (input) {
  const { isSet, error } = this.bajo.helper
  if (input.length === 2 && !input.includes(',')) return await getCountryBbox.call(this, input)
  const [minx, miny, maxx, maxy] = input.split(',').map(b => parseFloat(b) || null)
  const valid = (isSet(minx) && isSet(miny) && isSet(maxx) && isSet(maxy)) &&
    (minx >= -180 && maxx <= 180 && miny >= -90 && maxy <= 90) &&
    (minx <= maxx && miny <= maxy)
  if (valid) return [minx, miny, maxx, maxy]
  throw error('Invalid bbox \'%s\'', input)
}

export default parseBbox
