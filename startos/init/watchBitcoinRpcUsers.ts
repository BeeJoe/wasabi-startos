// Bitcoin flavors share the `bitcoind` package identity, actions, and config
// schema. Bitcoin Core is the canonical build-time package for that contract.
import { generateRpcUserDependent } from 'bitcoin-core-startos/startos/actions/generateRpcUserDependent'
import { bitcoinConfFile } from 'bitcoin-core-startos/startos/fileModels/bitcoin.conf'
import { rpcHostId, rpcPort } from 'bitcoin-core-startos/startos/utils'
import { bitcoinRpcAuthMatches } from '../bitcoinRpcAuth'
import { store } from '../fileModels/store.yaml'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { generateRpcPassword } from '../utils'

export const watchBitcoinRpcUsers = sdk.setupOnInit(async (effects) => {
  const settings = await store.read().const(effects)

  if (
    !settings?.wasabi.managesettings ||
    settings.wasabi.server.type !== 'bitcoind'
  ) {
    await sdk.action.clearTask(effects, 'request-rpc-credentials')
    return
  }

  const bitcoinRpc = await sdk.host
    .getBridgeAddress(effects, {
      packageId: 'bitcoind',
      hostId: rpcHostId,
      internalPort: rpcPort,
      ssl: false,
    })
    .const()

  if (!bitcoinRpc) {
    await sdk.action.clearTask(effects, 'request-rpc-credentials')
    return
  }

  const currentUser = settings.wasabi.server.user
  const currentPassword = settings.wasabi.server.password

  if (!currentUser || !currentPassword) {
    await store.merge(
      effects,
      {
        wasabi: {
          server: {
            user: `wasabi_${generateRpcPassword(6)}`,
            password: generateRpcPassword(),
          },
        },
      },
      { allowWriteAfterConst: true },
    )
    return
  }

  await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'main' },
    sdk.Mounts.of().mountDependency({
      dependencyId: 'bitcoind',
      volumeId: 'main',
      mountpoint: '/mnt/bitcoind',
      subpath: null,
      readonly: true,
      type: 'directory',
    }),
    'read-bitcoin-config',
    async (subcontainer) => {
      const bitcoinConf = await bitcoinConfFile
        .withPath(`${subcontainer.rootfs}/mnt/bitcoind/bitcoin.conf`)
        .read()
        .once()

      const rpcAuth = bitcoinConf?.raw?.rpcauth ?? []
      const rpcAuthEntries = [rpcAuth]
        .flat()
        .filter((entry): entry is string => Boolean(entry))

      if (
        rpcAuthEntries.some((entry) =>
          bitcoinRpcAuthMatches(entry, currentUser, currentPassword),
        )
      ) {
        await sdk.action.clearTask(effects, 'request-rpc-credentials')
        return
      }

      const usernameCollision = rpcAuthEntries.some(
        (entry) => entry.slice(0, entry.indexOf(':')) === currentUser,
      )

      if (usernameCollision) {
        await sdk.action.clearTask(effects, 'request-rpc-credentials')
        await store.merge(
          effects,
          {
            wasabi: {
              server: {
                user: `wasabi_${generateRpcPassword(6)}`,
                password: generateRpcPassword(),
              },
            },
          },
          { allowWriteAfterConst: true },
        )
        return
      }

      await sdk.action.createTask(
        effects,
        'bitcoind',
        generateRpcUserDependent,
        'critical',
        {
          replayId: 'request-rpc-credentials',
          reason: i18n('Create RPC credentials for Wasabi'),
          input: {
            kind: 'partial',
            accept: [
              {
                username: currentUser,
                password: currentPassword,
              },
            ],
            set: {
              username: currentUser,
              password: currentPassword,
            },
          },
        },
      )
    },
  )
})
