import { bitcoinRpcBinding } from './bitcoinProvider'
import { configFile, ConfigFileType } from './fileModels/config.json'
import { store } from './fileModels/store.yaml'
import { uiConfigFile } from './fileModels/uiConfig.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { ensureFileExists, removeUtf8Bom, uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  const conf = await store.read().const(effects)
  if (!conf?.password) throw new Error(i18n('Password is required'))

  const bitcoinRpc =
    conf.wasabi.managesettings && conf.wasabi.server.type === 'bitcoind'
      ? await sdk.host.getBridgeAddress(effects, bitcoinRpcBinding).const()
      : null

  const subcontainer = await sdk.SubContainer.eager(
    effects,
    { imageId: 'main' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/root/data',
        readonly: false,
      })
      .mountVolume({
        volumeId: 'userdir',
        subpath: null,
        mountpoint: '/config',
        readonly: false,
      }),
    'main',
  )

  await subcontainer.execFail([
    'sh',
    '-c',
    'find /dev/dri -mindepth 1 -maxdepth 1 -exec chmod o+rw {} + 2>/dev/null || true',
  ])

  await ensureFileExists(
    subcontainer,
    '/defaults/.walletwasabi/client/Config.json',
    '/config/.walletwasabi/client/Config.json',
  )
  await ensureFileExists(
    subcontainer,
    '/defaults/.walletwasabi/client/UiConfig.json',
    '/config/.walletwasabi/client/UiConfig.json',
  )
  await subcontainer.execFail(['chown', '-R', '1000:1000', '/config'])

  await removeUtf8Bom(
    subcontainer,
    '/config/.walletwasabi/client/UiConfig.json',
  )
  await uiConfigFile.merge(effects, {
    Oobe: false,
    WindowState: 'Maximized',
  })

  if (conf.wasabi.managesettings) {
    let config: Partial<ConfigFileType>
    const hasBitcoinCredentials = Boolean(
      conf.wasabi.server.user && conf.wasabi.server.password,
    )

    if (
      conf.wasabi.server.type === 'bitcoind' &&
      bitcoinRpc &&
      hasBitcoinCredentials
    ) {
      config = {
        UseBitcoinRpc: true,
        BitcoinRpcEndPoint: bitcoinRpc,
        BitcoinRpcCredentialString: `${conf.wasabi.server.user}:${conf.wasabi.server.password}`,
      }
    } else {
      config = {
        UseBitcoinRpc: false,
        BitcoinRpcEndPoint: '',
        BitcoinRpcCredentialString: '',
      }
    }

    config = {
      ...config,
      UseTor: conf.wasabi.useTor ? 'Enabled' : 'Disabled',
      JsonRpcServerEnabled: conf.wasabi.rpc.enable,
      JsonRpcUser: conf.wasabi.rpc.username ?? '',
      JsonRpcPassword: conf.wasabi.rpc.password ?? '',
      JsonRpcServerPrefixes: ['http://+:37128/'],
    }

    await removeUtf8Bom(
      subcontainer,
      '/config/.walletwasabi/client/Config.json',
    )
    await configFile.merge(effects, config)
  }

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer,
    exec: {
      command: sdk.useEntrypoint(),
      runAsInit: true,
      env: {
        PUID: '1000',
        PGID: '1000',
        TZ: 'Etc/UTC',
        TITLE: conf.title,
        CUSTOM_USER: conf.username,
        PASSWORD: conf.password,
      },
    },
    ready: {
      display: i18n('Web Interface'),
      fn: () =>
        sdk.healthCheck.checkWebUrl(effects, `http://127.0.0.1:${uiPort}`, {
          successMessage: i18n('The web interface is ready'),
          errorMessage: i18n('The web interface is unreachable'),
        }),
      gracePeriod: 60_000,
    },
    requires: [],
  })
})
