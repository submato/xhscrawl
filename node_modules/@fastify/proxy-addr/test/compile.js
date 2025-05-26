'use strict'

const test = require('tape')
const proxyaddr = require('..')

test('trust arg should be required', function (t) {
  t.throws(proxyaddr.compile, /argument.*required/u)
  t.end()
})

test('trust arg should accept an array', function (t) {
  t.equal(typeof proxyaddr.compile([]), 'function')
  t.end()
})

test('trust arg should accept a string', function (t) {
  t.equal(typeof proxyaddr.compile('127.0.0.1'), 'function')
  t.end()
})

test('trust arg should reject a number', function (t) {
  t.throws(proxyaddr.compile.bind(null, 42), /unsupported trust argument/u)
  t.end()
})

test('trust arg should accept IPv4', function (t) {
  t.equal(typeof proxyaddr.compile('127.0.0.1'), 'function')
  t.end()
})

test('trust arg should accept IPv6', function (t) {
  t.equal(typeof proxyaddr.compile('::1'), 'function')
  t.end()
})

test('trust arg should accept IPv4-style IPv6', function (t) {
  t.equal(typeof proxyaddr.compile('::ffff:127.0.0.1'), 'function')
  t.end()
})

test('trust arg should accept pre-defined names', function (t) {
  t.equal(typeof proxyaddr.compile('loopback'), 'function')
  t.end()
})

test('trust arg should accept pre-defined names in array', function (t) {
  t.equal(typeof proxyaddr.compile(['loopback', '10.0.0.1']), 'function')
  t.end()
})

test('trust arg should reject non-IP', function (t) {
  t.throws(proxyaddr.compile.bind(null, 'blargh'), /invalid IP address/u)
  t.throws(proxyaddr.compile.bind(null, '-1'), /invalid IP address/u)
  t.end()
})

test('trust arg should reject bad CIDR', function (t) {
  t.throws(proxyaddr.compile.bind(null, '10.0.0.1/6000'), /invalid range on address/u)
  t.throws(proxyaddr.compile.bind(null, '::1/6000'), /invalid range on address/u)
  t.throws(proxyaddr.compile.bind(null, '::ffff:a00:2/136'), /invalid range on address/u)
  t.throws(proxyaddr.compile.bind(null, '::ffff:a00:2/-46'), /invalid range on address/u)
  t.end()
})

test('trust arg should not alter input array', function (t) {
  const arr = ['loopback', '10.0.0.1']
  t.equal(typeof proxyaddr.compile(arr), 'function')
  t.same(arr, ['loopback', '10.0.0.1'])
  t.end()
})
