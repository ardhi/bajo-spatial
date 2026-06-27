/* global describe, it, beforeEach */

import { expect } from 'chai'

import factory from '../index.js'

describe('BajoSpatial', () => {
  let app
  let BajoSpatial
  let spatial

  beforeEach(async () => {
    app = {
      lib: {
        _: {
          merge: (target, source) => Object.assign(target, source),
          isEmpty: (value) => {
            if (value == null) return true
            if (Array.isArray(value) || typeof value === 'string') return value.length === 0
            if (typeof value === 'object') return Object.keys(value).length === 0
            return false
          }
        },
        aneka: {
          isSet: (value) => value !== null && value !== undefined
        }
      },
      baseClass: {
        Base: class Base {
          constructor (pkgName, appRef) {
            this.pkgName = pkgName
            this.app = appRef
          }

          error (msg, item) {
            const text = msg.replace('%s', item)
            return new Error(text)
          }
        }
      }
    }

    BajoSpatial = await factory.call({ app }, 'bajo-spatial')
    spatial = new BajoSpatial()
  })

  it('initializes with empty config object', () => {
    expect(spatial.config).to.deep.equal({})
  })

  it('parseBbox parses valid coordinates', async () => {
    const result = await spatial.parseBbox('100,-10,120,10')

    expect(result).to.deep.equal([100, -10, 120, 10])
  })

  it('parseBbox throws for invalid coordinates', async () => {
    try {
      await spatial.parseBbox('100,-10,200,10')
      expect.fail('Expected parseBbox to throw')
    } catch (err) {
      expect(err.message).to.equal("Invalid bbox '100,-10,200,10'")
    }
  })

  it('parseBbox resolves country code through getCountryBbox', async () => {
    spatial.getCountryBbox = async (code) => {
      expect(code).to.equal('ID')
      return [95, -11, 141, 6]
    }

    const result = await spatial.parseBbox('ID')

    expect(result).to.deep.equal([95, -11, 141, 6])
  })

  it('buildBboxQuery returns merged query when fields exist', async () => {
    const model = { properties: [{ name: 'lat' }, { name: 'lng' }] }

    const result = await spatial.buildBboxQuery({
      bbox: '100,-10,120,10',
      query: { status: 'active' },
      model
    })

    expect(result).to.deep.equal({
      status: 'active',
      lng: { $gte: 100, $lte: 120 },
      lat: { $gte: -10, $lte: 10 }
    })
  })

  it('buildBboxQuery appends bbox query to $and', async () => {
    const model = { properties: [{ name: 'lat' }, { name: 'lng' }] }
    const query = { $and: [{ status: 'active' }] }

    const result = await spatial.buildBboxQuery({
      bbox: '100,-10,120,10',
      query,
      model
    })

    expect(result.$and).to.have.lengthOf(2)
    expect(result.$and[1]).to.deep.equal({
      lng: { $gte: 100, $lte: 120 },
      lat: { $gte: -10, $lte: 10 }
    })
  })

  it('buildBboxQuery converts $or query into $and with bbox query', async () => {
    const model = { properties: [{ name: 'lat' }, { name: 'lng' }] }
    const query = { $or: [{ status: 'active' }, { status: 'pending' }] }

    const result = await spatial.buildBboxQuery({
      bbox: '100,-10,120,10',
      query,
      model
    })

    expect(result).to.deep.equal({
      $and: [
        [{ status: 'active' }, { status: 'pending' }],
        {
          lng: { $gte: 100, $lte: 120 },
          lat: { $gte: -10, $lte: 10 }
        }
      ]
    })
  })

  it('buildBboxQuery returns original query when model fields are missing', async () => {
    const model = { properties: [{ name: 'latitude' }, { name: 'longitude' }] }
    const query = { status: 'active' }

    const result = await spatial.buildBboxQuery({
      bbox: '100,-10,120,10',
      query,
      model
    })

    expect(result).to.deep.equal({ status: 'active' })
  })

  it('getCountryBbox returns undefined for direct bbox string or missing dependencies', async () => {
    expect(await spatial.getCountryBbox('1,2,3,4')).to.equal(undefined)
    expect(await spatial.getCountryBbox('ID')).to.equal(undefined)
  })

  it('getCountryBbox returns bbox from CdbCountry model', async () => {
    app.bajoCommonDb = {}
    app.dobo = {
      getModel: () => ({
        getRecord: async (id, opts) => {
          expect(id).to.equal('ID')
          expect(opts).to.deep.equal({ throwNotFound: false })
          return { bbox: '95,-11,141,6' }
        }
      })
    }

    const result = await spatial.getCountryBbox('ID')

    expect(result).to.equal('95,-11,141,6')
  })

  it('getCountryBbox throws when country id is unknown', async () => {
    app.bajoCommonDb = {}
    app.dobo = {
      getModel: () => ({
        getRecord: async () => null
      })
    }

    try {
      await spatial.getCountryBbox('ID')
      expect.fail('Expected getCountryBbox to throw')
    } catch (err) {
      expect(err.message).to.equal("Invalid country bbox 'ID'")
    }
  })
})
