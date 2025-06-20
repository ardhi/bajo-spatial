import * as turf from '@turf/turf'
import anekaSpatial from 'aneka-spatial/index.js'

async function factory (pkgName) {
  const me = this

  return class BajoSpatial extends this.lib.BajoPlugin {
    constructor () {
      super(pkgName, me.app)
      this.alias = 'spatial'
      this.config = {}
      this.lib.turf = turf
      this.lib.anekaSpatial = anekaSpatial
    }

    buildBboxQuery = async ({ bbox, query, schema, options = {} } = {}) => {
      const { merge, isEmpty } = this.lib._
      const props = schema.properties.map(item => item.name)
      const { bboxLatField = 'lat', bboxLngField = 'lng' } = options
      if (props.includes(bboxLatField) && props.includes(bboxLngField)) {
        const [minx, miny, maxx, maxy] = await this.parseBbox(bbox)
        const q = {}
        q[bboxLngField] = { $gte: minx, $lte: maxx }
        q[bboxLatField] = { $gte: miny, $lte: maxy }
        if (isEmpty(query)) query = q
        else {
          const $or = query.$or
          if ($or) query = merge(q, { $or })
          else merge(query, q)
        }
      }
      return query
    }

    getCountryBbox = async (item) => {
      item = item + ''
      if (item.includes(',')) return
      if (!this.app.bajoCommonDb || !this.app.dobo) return
      const { recordGet } = this.app.dobo
      const country = await recordGet('CdbCountry', item, { thrownNotFound: false })
      if (country) return country.bbox
      throw this.error('Invalid country bbox \'%s\'', item, { statusCode: 400 })
    }

    parseBbox = async (input) => {
      const { isSet } = this.lib.aneka
      if (input.length === 2 && !input.includes(',')) return await this.getCountryBbox(input)
      const [minx, miny, maxx, maxy] = input.split(',').map(b => parseFloat(b) || null)
      const valid = (isSet(minx) && isSet(miny) && isSet(maxx) && isSet(maxy)) &&
        (minx >= -180 && maxx <= 180 && miny >= -90 && maxy <= 90)
        // (minx <= maxx && miny <= maxy)
      if (valid) return [minx, miny, maxx, maxy]
      throw this.error('Invalid bbox \'%s\'', input)
    }
  }
}

export default factory
