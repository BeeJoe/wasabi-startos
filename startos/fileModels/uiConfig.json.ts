import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const UiConfigShape = z.object({
  Oobe: z.boolean(),
  WindowState: z.union([
    z.literal('Normal'),
    z.literal('Minimized'),
    z.literal('Maximized'),
    z.literal('FullScreen'),
  ]),
})

export const uiConfigFile = FileHelper.json(
  {
    base: sdk.volumes.userdir,
    subpath: '.walletwasabi/client/UiConfig.json',
  },
  UiConfigShape,
)
