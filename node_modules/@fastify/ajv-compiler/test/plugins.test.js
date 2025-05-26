'use strict'

const t = require('tap')
const fastify = require('fastify')
const AjvCompiler = require('../index')

const ajvFormats = require('ajv-formats')
const ajvErrors = require('ajv-errors')
const localize = require('ajv-i18n')

t.test('Format Baseline test', async (t) => {
  const app = buildApplication({
    customOptions: {
      validateFormats: false
    }
  })

  const res = await app.inject({
    url: '/hello',
    headers: {
      'x-foo': 'hello',
      'x-date': 'not a date',
      'x-email': 'not an email'
    },
    query: {
      foo: 'hello',
      date: 'not a date',
      email: 'not an email'
    }
  })
  t.equal(res.statusCode, 200, 'format validation does not apply as configured')
  t.equal(res.payload, 'hello')
})

t.test('Custom Format plugin loading test', (t) => {
  t.plan(6)
  const app = buildApplication({
    customOptions: {
      validateFormats: true
    },
    plugins: [[ajvFormats, { mode: 'fast' }]]
  })

  app.inject('/hello', (err, res) => {
    t.error(err)
    t.equal(res.statusCode, 400, 'format validation applies')
  })

  app.inject('/2ad0612c-7578-4b18-9a6f-579863f40e0b', (err, res) => {
    t.error(err)
    t.equal(res.statusCode, 400, 'format validation applies')
  })

  app.inject({
    url: '/2ad0612c-7578-4b18-9a6f-579863f40e0b',
    headers: {
      'x-foo': 'hello',
      'x-date': new Date().toISOString(),
      'x-email': 'foo@bar.baz'
    },
    query: {
      foo: 'hello',
      date: new Date().toISOString(),
      email: 'foo@bar.baz'
    }
  }, (err, res) => {
    t.error(err)
    t.equal(res.statusCode, 200)
  })
})

t.test('Format plugin set by default test', (t) => {
  t.plan(6)
  const app = buildApplication({})

  app.inject('/hello', (err, res) => {
    t.error(err)
    t.equal(res.statusCode, 400, 'format validation applies')
  })

  app.inject('/2ad0612c-7578-4b18-9a6f-579863f40e0b', (err, res) => {
    t.error(err)
    t.equal(res.statusCode, 400, 'format validation applies')
  })

  app.inject({
    url: '/2ad0612c-7578-4b18-9a6f-579863f40e0b',
    headers: {
      'x-foo': 'hello',
      'x-date': new Date().toISOString(),
      'x-email': 'foo@bar.baz'
    },
    query: {
      foo: 'hello',
      date: new Date().toISOString(),
      email: 'foo@bar.baz'
    }
  }, (err, res) => {
    t.error(err)
    t.equal(res.statusCode, 200)
  })
})

t.test('Custom error messages', (t) => {
  t.plan(9)

  const app = buildApplication({
    customOptions: {
      removeAdditional: false,
      allErrors: true
    },
    plugins: [ajvFormats, ajvErrors]
  })

  const errorMessage = {
    required: 'custom miss',
    type: 'custom type', // will not replace internal "type" error for the property "foo"
    _: 'custom type', // this prop will do it
    additionalProperties: 'custom too many params'
  }

  app.post('/', {
    handler: () => { t.fail('dont call me') },
    schema: {
      body: {
        type: 'object',
        required: ['foo'],
        properties: {
          foo: { type: 'integer' }
        },
        additionalProperties: false,
        errorMessage
      }
    }
  })

  app.inject({
    url: '/',
    method: 'post',
    payload: {}
  }, (err, res) => {
    t.error(err)
    t.equal(res.statusCode, 400)
    t.match(res.json().message, errorMessage.required)
  })

  app.inject({
    url: '/',
    method: 'post',
    payload: { foo: 'not a number' }
  }, (err, res) => {
    t.error(err)
    t.equal(res.statusCode, 400)
    t.match(res.json().message, errorMessage.type)
  })

  app.inject({
    url: '/',
    method: 'post',
    payload: { foo: 3, bar: 'ops' }
  }, (err, res) => {
    t.error(err)
    t.equal(res.statusCode, 400)
    t.match(res.json().message, errorMessage.additionalProperties)
  })
})

t.test('Custom i18n error messages', (t) => {
  t.plan(3)

  const app = buildApplication({
    customOptions: {
      allErrors: true,
      messages: false
    },
    plugins: [ajvFormats]
  })

  app.post('/', {
    handler: () => { t.fail('dont call me') },
    schema: {
      body: {
        type: 'object',
        required: ['foo'],
        properties: {
          foo: { type: 'integer' }
        }
      }
    }
  })

  app.setErrorHandler((error, request, reply) => {
    t.pass('Error handler executed')
    if (error.validation) {
      localize.ru(error.validation)
      reply.status(400).send(error.validation)
      return
    }
    t.fail('not other errors')
  })

  app.inject({
    method: 'POST',
    url: '/',
    payload: {
      foo: 'string'
    }
  }, (err, res) => {
    t.error(err)
    t.equal(res.json()[0].message, 'должно быть integer')
  })
})

function buildApplication (ajvOptions) {
  const factory = AjvCompiler()

  const app = fastify({
    ajv: ajvOptions,
    schemaController: {
      compilersFactory: {
        buildValidator: factory
      }
    }
  })

  app.get('/:id', {
    schema: {
      headers: {
        type: 'object',
        required: [
          'x-foo',
          'x-date',
          'x-email'
        ],
        properties: {
          'x-foo': { type: 'string' },
          'x-date': { type: 'string', format: 'date-time' },
          'x-email': { type: 'string', format: 'email' }
        }
      },
      query: {
        type: 'object',
        required: [
          'foo',
          'date',
          'email'
        ],
        properties: {
          foo: { type: 'string' },
          date: { type: 'string', format: 'date-time' },
          email: { type: 'string', format: 'email' }
        }
      },
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      }
    }
  }, async () => 'hello')

  return app
}
