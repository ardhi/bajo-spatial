/**
 * Plugin factory.
 *
 * **Never** call this function directly!!! It's only-meant to be called by the {@link https://ardhi.github.io/bajo|Bajo framework} during plugin initialization.
 *
 * @param {string} pkgName - NPM package name
 * @returns {class} BajoSpatial
 */
async function factory (pkgName) {
  const me = this

  /**
   * BajoSpatial class definition
   *
   * @class
   */
  class BajoSpatial extends this.app.baseClass.Base {
    /**
     * Creates an instance of BajoSpatial.
     */
    constructor () {
      super(pkgName, me.app)
      /**
       * @property {object} config - Configuration object
       */
      this.config = {}
    }

    /**
     * Builds a bounding box query for a given model.
     *
     * @async
     * @method
     * @param {object} params - Parameters for building the query.
     * @param {string} params.bbox - Bounding box coordinates.
     * @param {object} [params.query={}] - Existing query object to merge with.
     * @param {object} params.model - {@link https://ardhi.github.io/dobo|Dobo model} to apply the query to.
     * @param {object} [params.options={}] - Additional options for query building.
     * @param {string} [params.options.bboxLatField='lat'] - Latitude field name in the model.
     * @param {string} [params.options.bboxLngField='lng'] - Longitude field name in the model.
     * @returns {object} - The modified query object with bounding box conditions.
     */
    buildBboxQuery = async (params = {}) => {
      let { bbox, query = {}, model, options = {} } = params
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

    /**
     * Gets the bounding box for a given country ID.
     * Requires the `bajoCommonDb` and `dobo` plugins to be available. Otherwise, it will return undefined.
     *
     * @async
     * @method
     * @param {string} item - Country ID.
     * @returns {Promise<string|undefined>} - The bounding box string or undefined if not found.
     */
    getCountryBbox = async (item) => {
      item = item + ''
      if (item.includes(',')) return
      if (!this.app.bajoCommonDb || !this.app.dobo) return
      const model = this.app.dobo.getModel('CdbCountry')
      const country = await model.getRecord(item, { throwNotFound: false })
      if (country) return country.bbox
      throw this.error('Invalid country bbox \'%s\'', item, { statusCode: 400 })
    }

    /**
     * Parses a bounding box input.
     *
     * @async
     * @method
     * @param {string} input - The bounding box input, either a country ID or coordinates.
     * @returns {Promise<Array<number>|undefined>} - The parsed bounding box coordinates or undefined if not found.
     */
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
