import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const WASABI_VERSION = '2.8.1'

export const current = VersionInfo.of({
  version: '2.8.1:3',
  releaseNotes: {
    en_US:
      'Automatically adopts the live RPC endpoint of any compatible local Bitcoin flavor and repairs stale RPC credentials instead of repeatedly receiving authentication errors.',
    es_ES:
      'Adopta automáticamente el endpoint RPC activo de cualquier variante local compatible de Bitcoin y repara credenciales RPC obsoletas en lugar de recibir errores de autenticación repetidos.',
    de_DE:
      'Übernimmt automatisch den aktiven RPC-Endpunkt jeder kompatiblen lokalen Bitcoin-Variante und repariert veraltete RPC-Zugangsdaten statt wiederholter Authentifizierungsfehler.',
    pl_PL:
      'Automatycznie używa aktywnego endpointu RPC dowolnego zgodnego lokalnego wariantu Bitcoin i naprawia nieaktualne dane RPC zamiast powtarzających się błędów uwierzytelniania.',
    fr_FR:
      "Adopte automatiquement le point d'accès RPC actif de toute variante Bitcoin locale compatible et répare les identifiants RPC obsolètes au lieu de produire des erreurs d'authentification répétées.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
