import _ from 'lodash-es'

const arrReg = /^\[.*\]$/
const objReg = /^\{.*\}$/

const getKeys = (_str: string) => {
  const str = _str.replace(/\s/g, '')
  if (arrReg.test(str) || objReg.test(str)) {
    return str.substring(1, str.length - 1).split(',')
  }
  return [str]
}

export const getSchemaFields = (
  schema: any,
  key = 'properties.search.properties',
) => {
  const fields: string[] = []
  _.keys(_.get(schema, key)).forEach((key) => {
    fields.push(...getKeys(key))
  })
  return fields
}
