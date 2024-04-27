const onBeforeRecordFind = {
  level: 1001,
  handler: async function (name, filter, options) {
    const { buildBboxQuery } = this.bajoSpatial.helper
    if (!filter.bbox) return
    const { getSchema } = this.bajoDb.helper
    const schema = getSchema(name)
    await buildBboxQuery({ bbox: filter.bbox, query: filter.query, schema, options })
  }
}

export default onBeforeRecordFind
