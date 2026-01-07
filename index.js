/**
 * Plugin factory
 *
 * @param {string} pkgName - NPM package name
 * @returns {class}
 */
async function factory (pkgName) {
  const me = this

  /**
   * BajoSpatial class
   *
   * @class
   */
  class BajoSpatial extends this.app.baseClass.Base {
    static alias = 'spatial'

    constructor () {
      super(pkgName, me.app)
      this.config = {}
    }

    buildBboxQuery = async ({ bbox, query = {}, model, options = {} } = {}) => {
      const { merge, isEmpty } = this.app.lib._
      const props = model.properties.map(item => item.name)
      const { bboxLatField = 'lat', bboxLngField = 'lng' } = options
      if (props.includes(bboxLatField) && props.includes(bboxLngField)) {
        const [minx, miny, maxx, maxy] = await this.parseBbox(bbox)
        const q = {}
        q[bboxLngField] = { $gte: minx, $lte: maxx }
        q[bboxLatField] = { $gte: miny, $lte: maxy }
        if (isEmpty(query)) query = q
        else {
          if (query.$and) {
            query.$and.push(q)
          } else if (query.$or) {
            const old = query.$or
            query = { $and: [old, q] }
          } else {
            merge(query, q)
          }
        }
      }
      return query
    }

    getCountryBbox = async (item) => {
      item = item + ''
      if (item.includes(',')) return
      if (!this.app.bajoCommonDb || !this.app.dobo) return
      const model = this.app.dobo.getModel('CdbCountry')
      const country = await model.getRecord(item, { throwNotFound: false })
      if (country) return country.bbox
      throw this.error('Invalid country bbox \'%s\'', item, { statusCode: 400 })
    }

    parseBbox = async (input) => {
      const { isSet } = this.app.lib.aneka
      if (input.length === 2 && !input.includes(',')) return await this.getCountryBbox(input)
      const [minx, miny, maxx, maxy] = input.split(',').map(b => parseFloat(b) || null)
      const valid = (isSet(minx) && isSet(miny) && isSet(maxx) && isSet(maxy)) &&
        (minx >= -180 && maxx <= 180 && miny >= -90 && maxy <= 90)
        // (minx <= maxx && miny <= maxy)
      if (valid) return [minx, miny, maxx, maxy]
      throw this.error('Invalid bbox \'%s\'', input)
    }
  }

  return BajoSpatial
}

export default factory
