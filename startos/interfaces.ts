import { store } from './fileModels/store.yaml'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { rpcPort, uiPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const mainHost = sdk.MultiHost.of(effects, 'main')
  const uiOrigin = await mainHost.bindPort(uiPort, {
    protocol: 'http',
    addSsl: { addXForwardedHeaders: true },
  })
  const ui = sdk.createInterface(effects, {
    name: i18n('Web UI'),
    id: 'ui',
    description: i18n('Browser-based Wasabi desktop'),
    type: 'ui',
    schemeOverride: null,
    masked: false,
    username: null,
    path: '',
    query: {},
  })

  const receipts = [await uiOrigin.export([ui])]
  const rpcEnabled =
    (await store.read((value) => value.wasabi.rpc.enable).const(effects)) ??
    false

  if (rpcEnabled) {
    const rpcOrigin = await mainHost.bindPort(rpcPort, {
      protocol: 'http',
      addSsl: { addXForwardedHeaders: true },
    })
    const rpc = sdk.createInterface(effects, {
      name: i18n('JSON-RPC'),
      id: 'rpc',
      description: i18n('Wasabi JSON-RPC interface'),
      type: 'api',
      schemeOverride: null,
      masked: false,
      username: null,
      path: '',
      query: {},
    })
    receipts.push(await rpcOrigin.export([rpc]))
  }

  return receipts
})
