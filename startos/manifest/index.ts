import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'
import { WASABI_VERSION } from '../versions'

export const manifest = setupManifest({
  id: 'wasabi-webtop',
  title: 'Wasabi Wallet',
  license: 'MIT',
  packageRepo: 'https://github.com/remcoros/wasabi-webtop-startos',
  upstreamRepo: 'https://github.com/WalletWasabi/WalletWasabi',
  marketingUrl: 'https://wasabiwallet.io/',
  donationUrl: 'https://docs.wasabiwallet.io/FAQ/FAQ-Contribution.html',
  description: { short, long },
  volumes: ['main', 'userdir'],
  images: {
    main: {
      source: {
        dockerTag: `ghcr.io/remcoros/wasabi-webtop:${WASABI_VERSION}`,
      },
      arch: ['x86_64'],
      nvidiaContainer: true,
    },
  },
  hardwareAcceleration: true,
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    bitcoind: {
      description:
        'Used to connect Wasabi to the installed Bitcoin service flavor.',
      optional: true,
      metadata: {
        title: 'Bitcoin Node',
        icon: 'https://bitcoin.org/img/icons/opengraph.png',
      },
    },
  },
})
