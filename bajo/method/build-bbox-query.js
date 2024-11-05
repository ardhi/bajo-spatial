async function buildBboxQuery ({ bbox, query, schema, options = {} } = {}) {
  const { merge, isEmpty } = this.app.bajo.lib._
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

export default buildBboxQuery
