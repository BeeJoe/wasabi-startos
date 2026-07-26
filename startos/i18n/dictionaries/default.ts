export const DEFAULT_LANG = 'en_US'

const dict = {
  'The web interface is ready': 1,
  'The web interface is unreachable': 2,
  'Password is required': 3,
  'Web Interface': 4,
  'Enable Compact Block Filters (BIP158) in the local Bitcoin node': 6,
  'Create RPC credentials for Wasabi': 7,
  'Web UI': 100,
  'Browser-based Wasabi desktop': 101,
  'JSON-RPC': 102,
  'Wasabi JSON-RPC interface': 103,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
