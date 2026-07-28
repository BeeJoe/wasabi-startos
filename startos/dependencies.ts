import {
  bitcoinConfig,
  bitcoinPackageId,
  bitcoinRpcBinding,
} from './bitcoinProvider'
import { store } from './fileModels/store.yaml'
import { i18n } from './i18n'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const conf = await store.read().const(effects)

  if (conf?.wasabi.managesettings && conf.wasabi.server.type === 'bitcoind') {
    const bitcoinRpc = await sdk.host
      .getBridgeAddress(effects, bitcoinRpcBinding)
      .const()

    if (bitcoinRpc) {
      await sdk.action.createTask(
        effects,
        bitcoinPackageId,
        bitcoinConfig,
        'critical',
        {
          replayId: 'request-compact-block-filters',
          when: {
            condition: 'input-not-matches',
            once: false,
          },
          reason: i18n(
            'Enable Compact Block Filters (BIP158) in the local Bitcoin node',
          ),
          input: {
            kind: 'partial',
            accept: [
              {
                blockfilters: {
                  blockfilterindex: true,
                },
              },
            ],
            set: {
              blockfilters: {
                blockfilterindex: true,
              },
            },
          },
        },
      )
    } else {
      await sdk.action.clearTask(effects, 'request-compact-block-filters')
    }

    return {
      [bitcoinPackageId]: {
        kind: 'exists',
        versionRange: '>=29.1',
      },
    }
  }

  await sdk.action.clearTask(effects, 'request-compact-block-filters')
  return {}
})
