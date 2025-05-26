'use strict'

const fastJsonStringify = require('fast-json-stringify')

function SerializerSelector () {
  return function buildSerializerFactory (externalSchemas, serializerOpts) {
    const fjsOpts = Object.assign({}, serializerOpts, { schema: externalSchemas })
    return responseSchemaCompiler.bind(null, fjsOpts)
  }
}

function responseSchemaCompiler (fjsOpts, { schema /* method, url, httpStatus */ }) {
  if (fjsOpts.schema && schema.$id && fjsOpts.schema[schema.$id]) {
    fjsOpts.schema = { ...fjsOpts.schema }
    delete fjsOpts.schema[schema.$id]
  }
  return fastJsonStringify(schema, fjsOpts)
}

module.exports = SerializerSelector
module.exports.default = SerializerSelector
module.exports.SerializerSelector = SerializerSelector
module.exports.StandaloneSerializer = require('./standalone')
