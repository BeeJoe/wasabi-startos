import { store } from '../fileModels/store.yaml'
import { sdk } from '../sdk'

export const uiCredentials = sdk.Action.withoutInput(
  'ui-credentials',
  async ({ effects }) => ({
    name: 'Show UI Credentials',
    description: 'Display the username and password for the Web UI.',
    warning: null,
    allowedStatuses: 'any',
    group: 'Configuration',
    visibility: (await store.read().const(effects)) ? 'enabled' : 'hidden',
  }),
  async ({ effects }) => {
    const conf = await store.read().const(effects)
    if (!conf?.password)
      throw new Error('Web UI credentials are not configured')

    return {
      version: '1',
      title: 'Web UI Credentials',
      message: null,
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: 'Username',
            description: 'Username for the Web UI',
            value: conf.username,
            copyable: true,
            masked: false,
            qr: false,
          },
          {
            type: 'single',
            name: 'Password',
            description: 'Password for the Web UI',
            value: conf.password,
            copyable: true,
            masked: true,
            qr: false,
          },
        ],
      },
    }
  },
)
