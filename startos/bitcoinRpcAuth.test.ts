import assert from 'node:assert/strict'
import { test } from 'node:test'
import { bitcoinRpcAuthMatches } from './bitcoinRpcAuth.ts'

const entry =
  'wasabi_user:0123456789abcdef$59fa6a4dccc441a2ceb3d563296276a0a2293d927d294d695cca0ca3c3556b35'

test('accepts an rpcauth entry matching both username and password', () => {
  assert.equal(bitcoinRpcAuthMatches(entry, 'wasabi_user', 'secret'), true)
})

test('rejects a stale password for the same username', () => {
  assert.equal(bitcoinRpcAuthMatches(entry, 'wasabi_user', 'stale'), false)
})

test('rejects a different username and malformed entries', () => {
  assert.equal(bitcoinRpcAuthMatches(entry, 'other_user', 'secret'), false)
  assert.equal(
    bitcoinRpcAuthMatches(
      'wasabi_user:not-an-rpcauth',
      'wasabi_user',
      'secret',
    ),
    false,
  )
})
