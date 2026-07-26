import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const ConfigShape = z.object({
  EnableGpu: z.boolean(),
  ConfigVersion: z.number(),
  UseBitcoinRpc: z.boolean(),
  BitcoinRpcEndPoint: z.string(),
  BitcoinRpcCredentialString: z.string(),
  UseTor: z.union([z.literal('Enabled'), z.literal('Disabled')]),
  JsonRpcServerEnabled: z.boolean(),
  JsonRpcUser: z.string(),
  JsonRpcPassword: z.string(),
  JsonRpcServerPrefixes: z.array(z.string()),
})

export type ConfigFileType = z.infer<typeof ConfigShape>

export const configFile = FileHelper.json(
  {
    base: sdk.volumes.userdir,
    subpath: '.walletwasabi/client/Config.json',
  },
  ConfigShape,
)
