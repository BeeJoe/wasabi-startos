import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const WASABI_VERSION = '2.8.1'

export const current = VersionInfo.of({
  version: '2.8.1:5',
  releaseNotes: {
    en_US:
      'Uses the conventional StartOS package ID “wasabi” instead of the legacy “wasabi-webtop” identity. Existing legacy-ID installations remain separate services.',
    es_ES:
      'Utiliza el ID de paquete convencional de StartOS «wasabi» en lugar de la identidad heredada «wasabi-webtop». Las instalaciones existentes con el ID heredado siguen siendo servicios separados.',
    de_DE:
      'Verwendet die konventionelle StartOS-Paket-ID „wasabi“ anstelle der bisherigen Identität „wasabi-webtop“. Bestehende Installationen mit der alten ID bleiben separate Dienste.',
    pl_PL:
      'Używa konwencjonalnego identyfikatora pakietu StartOS „wasabi” zamiast starszej tożsamości „wasabi-webtop”. Istniejące instalacje ze starszym identyfikatorem pozostają oddzielnymi usługami.',
    fr_FR:
      "Utilise l'identifiant de paquet StartOS conventionnel « wasabi » au lieu de l'ancienne identité « wasabi-webtop ». Les installations existantes utilisant l'ancien identifiant restent des services distincts.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
