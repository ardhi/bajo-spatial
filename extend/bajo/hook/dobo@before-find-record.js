const beforeFindRecord = {
  level: 1001,
  handler: async function (modelName, filter, options) {
    if (!filter.bbox || !this.app.dobo) return
    const model = this.app.dobo.getModel(modelName)
    filter.query = await this.buildBboxQuery({ bbox: filter.bbox, query: filter.query, model, options })
  }
}

export default beforeFindRecord
