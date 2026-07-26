import { FileHelper, T, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const StoreShape = z.object({
  title: z.string(),
  username: z.string(),
  password: z.string().optional(),
  wasabi: z.object({
    managesettings: z.boolean(),
    server: z.object({
      type: z
        .union([z.literal('bitcoind'), z.literal('none')])
        .catch('bitcoind'),
      user: z.string(),
      password: z.string(),
    }),
    useTor: z.boolean(),
    rpc: z.object({
      enable: z.boolean(),
      username: z.string().optional(),
      password: z.string().optional(),
    }),
  }),
})

export const store = FileHelper.yaml(
  {
    base: sdk.volumes.main,
    subpath: 'start9/config.yaml',
  },
  StoreShape,
)

export const createDefaultStore = async (effects: T.Effects) => {
  const existing = await store.read().once()
  if (existing) {
    await store.merge(effects, {
      wasabi: {
        server: {
          user: '',
          password: '',
        },
      },
    })
    return
  }

  await store.write(effects, {
    title: 'Wasabi Wallet on StartOS',
    username: 'webtop',
    wasabi: {
      managesettings: true,
      server: {
        type: 'bitcoind',
        user: '',
        password: '',
      },
      useTor: true,
      rpc: {
        enable: false,
      },
    },
  })
}
