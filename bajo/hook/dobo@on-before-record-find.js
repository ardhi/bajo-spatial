const onBeforeRecordFind = {
  level: 1001,
  handler: async function (name, filter, options) {
    if (!filter.bbox) return
    const { getSchema } = this.app.dobo
    const schema = getSchema(name)
    filter.query = await this.buildBboxQuery({ bbox: filter.bbox, query: filter.query, schema, options })
  }
}

export default onBeforeRecordFind
