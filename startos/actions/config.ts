import { T, utils } from '@start9labs/start-sdk'
import { createDefaultStore, store } from '../fileModels/store.yaml'
import { sdk } from '../sdk'

const { InputSpec, Value, Variants } = sdk

export const configInput = InputSpec.of({
  title: Value.text({
    name: 'Webtop Title',
    description: 'The title displayed in the browser tab.',
    required: true,
    default: 'Wasabi Wallet on StartOS',
    placeholder: 'Wasabi Wallet on StartOS',
    patterns: [utils.Patterns.ascii],
  }),
  username: Value.text({
    name: 'Username',
    description: 'The username used to log in to the browser desktop.',
    required: true,
    default: 'webtop',
    placeholder: '',
    masked: false,
    patterns: [utils.Patterns.ascii],
  }),
  password: Value.text({
    name: 'Password',
    description: 'The password used to log in to the browser desktop.',
    required: true,
    generate: {
      charset: 'a-z,0-9',
      len: 20,
    },
    default: { charset: 'a-z,0-9', len: 20 },
    placeholder: '',
    masked: true,
    minLength: 8,
  }),
  wasabi: Value.object(
    {
      name: 'Wasabi Settings',
      description: 'Node, network, and JSON-RPC settings managed by StartOS.',
    },
    InputSpec.of({
      managesettings: Value.toggle({
        name: 'Apply Settings on Startup',
        description:
          'Disable this to manage node, Tor, and JSON-RPC settings inside Wasabi.',
        default: true,
      }),
      server: Value.dynamicUnion(async () => {
        return {
          name: 'Bitcoin Node',
          description:
            'Automatically use the installed Bitcoin service flavor on this StartOS server when available.',
          default: 'bitcoind' as const,
          disabled: false,
          variants: Variants.of({
            bitcoind: {
              name: 'Automatic Local Bitcoin Node (recommended)',
              spec: InputSpec.of({}),
            },
            none: {
              name: 'Do Not Use a Local Bitcoin Node',
              spec: InputSpec.of({}),
            },
          }),
        }
      }),
      useTor: Value.toggle({
        name: 'Use Tor in Wasabi',
        description: 'Configure Wasabi Wallet to use its bundled Tor process.',
        default: true,
      }),
      rpc: Value.object(
        {
          name: 'JSON-RPC Server',
          description: 'Programmatic access to Wasabi Wallet.',
        },
        InputSpec.of({
          enable: Value.toggle({
            name: 'Enable JSON-RPC',
            description: 'Expose the authenticated Wasabi JSON-RPC interface.',
            default: false,
          }),
          username: Value.text({
            name: 'RPC Username',
            description: 'Username for JSON-RPC authentication.',
            required: true,
            default: 'wasabi',
            placeholder: '',
            patterns: [utils.Patterns.ascii],
          }),
          password: Value.text({
            name: 'RPC Password',
            description: 'Password for JSON-RPC authentication.',
            required: true,
            generate: {
              charset: 'a-z,0-9',
              len: 20,
            },
            default: { charset: 'a-z,0-9', len: 20 },
            placeholder: '',
            masked: true,
            minLength: 8,
          }),
        }),
      ),
    }),
  ),
})

export const config = sdk.Action.withInput(
  'config',
  async () => ({
    name: 'Settings',
    description: 'Configure Webtop access, Bitcoin, Tor, and JSON-RPC.',
    warning: null,
    allowedStatuses: 'any',
    group: 'Configuration',
    visibility: 'enabled',
  }),
  configInput,
  async ({ effects }) => readSettings(effects),
  async ({ effects, input }) => {
    await store.merge(effects, {
      title: input.title,
      username: input.username,
      password: input.password,
      wasabi: {
        managesettings: input.wasabi.managesettings,
        server: {
          type: input.wasabi.server.selection,
        },
        useTor: input.wasabi.useTor,
        rpc: {
          enable: input.wasabi.rpc.enable,
          username: input.wasabi.rpc.username,
          password: input.wasabi.rpc.password,
        },
      },
    })
  },
)

type ConfigInput = typeof configInput._PARTIAL

async function readSettings(effects: T.Effects): Promise<ConfigInput> {
  let settings = await store.read().once()
  if (!settings) {
    await createDefaultStore(effects)
    settings = (await store.read().once())!
  }

  return {
    title: settings.title,
    username: settings.username,
    password: settings.password,
    wasabi: {
      managesettings: settings.wasabi.managesettings,
      server: {
        selection: settings.wasabi.server.type,
      },
      useTor: settings.wasabi.useTor,
      rpc: {
        enable: settings.wasabi.rpc.enable,
        username: settings.wasabi.rpc.username,
        password: settings.wasabi.rpc.password,
      },
    },
  }
}
