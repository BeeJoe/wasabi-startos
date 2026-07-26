import { SubContainerEager, T } from '@start9labs/start-sdk'
import crypto from 'node:crypto'
import * as fs from 'node:fs/promises'
import path from 'node:path'

export const uiPort = 3000
export const rpcPort = 37128

const passwordChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export const generateRpcPassword = (length = 20) =>
  Array.from(crypto.randomBytes(length))
    .map((byte) => passwordChars[byte % passwordChars.length])
    .join('')

export async function ensureFileExists<
  Manifest extends T.SDKManifest,
  Effects extends T.Effects,
>(
  subcontainer: SubContainerEager<Manifest, Effects>,
  source: string,
  destination: string,
) {
  try {
    await fs.access(`${subcontainer.rootfs}${destination}`, fs.constants.F_OK)
  } catch {
    await subcontainer.execFail([
      'mkdir',
      '-p',
      path.posix.dirname(destination),
    ])
    await subcontainer.execFail(['cp', source, destination])
  }
}

export async function removeUtf8Bom<
  Manifest extends T.SDKManifest,
  Effects extends T.Effects,
>(subcontainer: SubContainerEager<Manifest, Effects>, filePath: string) {
  await subcontainer.execFail(['sed', '-i', '1s/^\uFEFF//', filePath])
}
