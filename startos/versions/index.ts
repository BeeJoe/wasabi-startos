import { VersionGraph } from '@start9labs/start-sdk'
import { current, WASABI_VERSION } from './current'

export const versionGraph = VersionGraph.of({
  current,
  other: [],
})

export { WASABI_VERSION }
