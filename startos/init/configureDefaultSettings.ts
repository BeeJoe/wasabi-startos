import { config } from '../actions/config'
import { store } from '../fileModels/store.yaml'
import { sdk } from '../sdk'

export const configureDefaultSettings = sdk.setupOnInit(
  async (effects, kind) => {
    if (kind !== 'install') return
    if (await store.read().once()) return

    await sdk.action.createOwnTask(effects, config, 'critical', {
      reason: 'Configure Wasabi before starting the service',
    })
  },
)
