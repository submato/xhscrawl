'use strict'

const t = require('tap')
const fastify = require('fastify')
const AjvCompiler = require('../index')

const sym = Symbol.for('fastify.ajv-compiler.reference')

const sampleSchema = Object.freeze({
  $id: 'example1',
  type: 'object',
  properties: {
    name: { type: 'string' }
  }
})

const externalSchemas1 = Object.freeze({})
const externalSchemas2 = Object.freeze({
  foo: {
    $id: 'foo',
    type: 'object',
    properties: {
      name: { type: 'string' }
    }
  }
})

const fastifyAjvOptionsDefault = Object.freeze({
  customOptions: {}
})

const fastifyJtdDefault = Object.freeze({
  customOptions: { },
  mode: 'JTD'
})

const fastifyAjvOptionsCustom = Object.freeze({
  customOptions: {
    allErrors: true,
    removeAdditional: false
  },
  plugins: [
    require('ajv-formats'),
    [require('ajv-errors'), { singleError: false }]
  ]
})

t.test('basic usage', t => {
  t.plan(1)
  const factory = AjvCompiler()
  const compiler = factory(externalSchemas1, fastifyAjvOptionsDefault)
  const validatorFunc = compiler({ schema: sampleSchema })
  const result = validatorFunc({ name: 'hello' })
  t.equal(result, true)
})

t.test('array coercion', t => {
  t.plan(2)
  const factory = AjvCompiler()
  const compiler = factory(externalSchemas1, fastifyAjvOptionsDefault)

  const arraySchema = {
    $id: 'example1',
    type: 'object',
    properties: {
      name: { type: 'array', items: { type: 'string' } }
    }
  }

  const validatorFunc = compiler({ schema: arraySchema })

  const inputObj = { name: 'hello' }
  t.equal(validatorFunc(inputObj), true)
  t.same(inputObj, { name: ['hello'] }, 'the name property should be coerced to an array')
})

t.test('nullable default', t => {
  t.plan(2)
  const factory = AjvCompiler()
  const compiler = factory({}, fastifyAjvOptionsDefault)
  const validatorFunc = compiler({
    schema: {
      type: 'object',
      properties: {
        nullable: { type: 'string', nullable: true },
        notNullable: { type: 'string' }
      }
    }
  })
  const input = { nullable: null, notNullable: null }
  const result = validatorFunc(input)
  t.equal(result, true)
  t.same(input, { nullable: null, notNullable: '' }, 'the notNullable field has been coerced')
})

t.test('plugin loading', t => {
  t.plan(3)
  const factory = AjvCompiler()
  const compiler = factory(externalSchemas1, fastifyAjvOptionsCustom)
  const validatorFunc = compiler({
    schema: {
      type: 'object',
      properties: {
        q: {
          type: 'string',
          format: 'date',
          formatMinimum: '2016-02-06',
          formatExclusiveMaximum: '2016-12-27'
        }
      },
      required: ['q'],
      errorMessage: 'hello world'
    }
  })
  const result = validatorFunc({ q: '2016-10-02' })
  t.equal(result, true)

  const resultFail = validatorFunc({})
  t.equal(resultFail, false)
  t.equal(validatorFunc.errors[0].message, 'hello world')
})

t.test('optimization - cache ajv instance', t => {
  t.plan(5)
  const factory = AjvCompiler()
  const compiler1 = factory(externalSchemas1, fastifyAjvOptionsDefault)
  const compiler2 = factory(externalSchemas1, fastifyAjvOptionsDefault)
  t.equal(compiler1, compiler2, 'same instance')
  t.same(compiler1, compiler2, 'same instance')

  const compiler3 = factory(externalSchemas2, fastifyAjvOptionsDefault)
  t.not(compiler3, compiler1, 'new ajv instance when externa schema change')

  const compiler4 = factory(externalSchemas1, fastifyAjvOptionsCustom)
  t.not(compiler4, compiler1, 'new ajv instance when externa schema change')
  t.not(compiler4, compiler3, 'new ajv instance when externa schema change')
})

t.test('the onCreate callback can enhance the ajv instance', t => {
  t.plan(2)
  const factory = AjvCompiler()

  const fastifyAjvCustomOptionsFormats = Object.freeze({
    onCreate (ajv) {
      for (const [formatName, format] of Object.entries(this.customOptions.formats)) {
        ajv.addFormat(formatName, format)
      }
    },
    customOptions: {
      formats: {
        date: /foo/
      }
    }
  })

  const compiler1 = factory(externalSchemas1, fastifyAjvCustomOptionsFormats)
  const validatorFunc = compiler1({
    schema: {
      type: 'string',
      format: 'date'
    }
  })
  const result = validatorFunc('foo')
  t.equal(result, true)

  const resultFail = validatorFunc('2016-10-02')
  t.equal(resultFail, false)
})

// https://github.com/fastify/fastify/pull/2969
t.test('compile same $id when in external schema', t => {
  t.plan(3)
  const factory = AjvCompiler()

  const base = {
    $id: 'urn:schema:base',
    definitions: {
      hello: { type: 'string' }
    },
    type: 'object',
    properties: {
      hello: { $ref: '#/definitions/hello' }
    }
  }

  const refSchema = {
    $id: 'urn:schema:ref',
    type: 'object',
    properties: {
      hello: { $ref: 'urn:schema:base#/definitions/hello' }
    }
  }

  const compiler = factory({
    [base.$id]: base,
    [refSchema.$id]: refSchema

  }, fastifyAjvOptionsDefault)

  t.notOk(compiler[sym], 'the ajv reference do not exists if code is not activated')

  const validatorFunc1 = compiler({
    schema: {
      $id: 'urn:schema:ref'
    }
  })

  const validatorFunc2 = compiler({
    schema: {
      $id: 'urn:schema:ref'
    }
  })

  t.pass('the compile does not fail if the schema compiled is already in the external schemas')
  t.equal(validatorFunc1, validatorFunc2, 'the returned function is the same')
})

t.test('JTD MODE', t => {
  t.plan(2)

  t.test('compile jtd schema', t => {
    t.plan(4)
    const factory = AjvCompiler()

    const jtdSchema = {
      discriminator: 'version',
      mapping: {
        1: {
          properties: {
            foo: { type: 'uint8' }
          }
        },
        2: {
          properties: {
            foo: { type: 'string' }
          }
        }
      }
    }

    const compiler = factory({}, fastifyJtdDefault)
    const validatorFunc = compiler({ schema: jtdSchema })
    t.pass('generated validation function for JTD SCHEMA')

    const result = validatorFunc({
      version: '2',
      foo: []
    })
    t.notOk(result, 'failed validation')
    t.type(validatorFunc.errors, 'Array')

    const success = validatorFunc({
      version: '1',
      foo: 42
    })
    t.ok(success)
  })

  t.test('fastify integration', async t => {
    const factory = AjvCompiler()

    const app = fastify({
      jsonShorthand: false,
      ajv: {
        customOptions: { },
        mode: 'JTD'
      },
      schemaController: {
        compilersFactory: {
          buildValidator: factory
        }
      }
    })

    app.post('/', {
      schema: {
        body: {
          discriminator: 'version',
          mapping: {
            1: {
              properties: {
                foo: { type: 'uint8' }
              }
            },
            2: {
              properties: {
                foo: { type: 'string' }
              }
            }
          }
        }
      }
    }, () => {})

    const res = await app.inject({
      url: '/',
      method: 'POST',
      payload: {
        version: '1',
        foo: 'this is not a number'
      }
    })

    t.equal(res.statusCode, 400)
    t.equal(res.json().message, 'body/foo must be uint8')
  })
})
