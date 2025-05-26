'use strict'

const test = require('tape')
const proxyaddr = require('..')

test('argument req should be required', function (t) {
  t.throws(proxyaddr.all, /req.*required/u)
  t.end()
})

test('argument trustshould be optional', function (t) {
  const req = createReq('127.0.0.1')
  t.doesNotThrow(proxyaddr.all.bind(null, req))
  t.end()
})

test('with no headers should return socket address', function (t) {
  const req = createReq('127.0.0.1')
  t.same(proxyaddr.all(req), ['127.0.0.1'])
  t.end()
})

test('with x-forwarded-for header should include x-forwarded-for', function (t) {
  const req = createReq('127.0.0.1', {
    'x-forwarded-for': '10.0.0.1'
  })
  t.same(proxyaddr.all(req), ['127.0.0.1', '10.0.0.1'])
  t.end()
})

test('with x-forwarded-for header should include x-forwarded-for in correct order', function (t) {
  const req = createReq('127.0.0.1', {
    'x-forwarded-for': '10.0.0.1, 10.0.0.2'
  })
  t.same(proxyaddr.all(req), ['127.0.0.1', '10.0.0.2', '10.0.0.1'])
  t.end()
})

test('with trust argument should stop at first untrusted', function (t) {
  const req = createReq('127.0.0.1', {
    'x-forwarded-for': '10.0.0.1, 10.0.0.2'
  })
  t.same(proxyaddr.all(req, '127.0.0.1'), ['127.0.0.1', '10.0.0.2'])
  t.end()
})

test('with trust argument should be only socket address for no trust', function (t) {
  const req = createReq('127.0.0.1', {
    'x-forwarded-for': '10.0.0.1, 10.0.0.2'
  })
  t.same(proxyaddr.all(req, []), ['127.0.0.1'])
  t.end()
})

function createReq (socketAddr, headers) {
  return {
    socket: {
      remoteAddress: socketAddr
    },
    headers: headers || {}
  }
}
