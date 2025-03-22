import turf from '@turf/turf'

async function factory (pkgName) {
  const me = this

  return class BajoSpatial extends this.lib.BajoPlugin {
    constructor () {
      super(pkgName, me.app)
      this.alias = 'spatial'
      this.config = {}
      this.lib.turf = turf
    }
  }
}

export default factory
