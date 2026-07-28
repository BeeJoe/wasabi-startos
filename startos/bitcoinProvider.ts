// All compatible Bitcoin flavors share the `bitcoind` package identity and
// provider contract. Bitcoin Core is the canonical build-time source for the
// shared action, file-model, host, and port types.
import { otherConfig } from 'bitcoin-core-startos/startos/actions/config/other'
import { generateRpcUserDependent } from 'bitcoin-core-startos/startos/actions/generateRpcUserDependent'
import { bitcoinConfFile } from 'bitcoin-core-startos/startos/fileModels/bitcoin.conf'
import { rpcHostId, rpcPort } from 'bitcoin-core-startos/startos/utils'

export const bitcoinPackageId = 'bitcoind'
export const bitcoinConfig = otherConfig
export { bitcoinConfFile, generateRpcUserDependent }

export const bitcoinRpcBinding = {
  packageId: bitcoinPackageId,
  hostId: rpcHostId,
  internalPort: rpcPort,
  ssl: false,
} as const
