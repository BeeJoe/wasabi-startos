import { createHmac, timingSafeEqual } from 'crypto'

export function bitcoinRpcAuthMatches(
  entry: string,
  username: string,
  password: string,
): boolean {
  const separator = entry.indexOf(':')
  const dollar = entry.indexOf('$', separator + 1)

  if (separator < 1 || dollar < separator + 2) return false
  if (entry.slice(0, separator) !== username) return false

  const salt = entry.slice(separator + 1, dollar)
  const expectedHex = entry.slice(dollar + 1)

  if (!/^[0-9a-f]{64}$/i.test(expectedHex)) return false

  const expected = Buffer.from(expectedHex, 'hex')
  const actual = Buffer.from(
    createHmac('sha256', salt).update(password).digest('hex'),
    'hex',
  )

  return timingSafeEqual(actual, expected)
}
