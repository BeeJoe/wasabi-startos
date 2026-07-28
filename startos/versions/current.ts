import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const WASABI_VERSION = '2.8.1'

export const current = VersionInfo.of({
  version: '2.8.1:4',
  releaseNotes: {
    en_US:
      'Separates Web UI and JSON-RPC gateway bindings, centralizes the shared Bitcoin flavor contract, and corrects package source metadata.',
    es_ES:
      'Separa los enlaces de puerta de enlace de la interfaz web y JSON-RPC, centraliza el contrato compartido de variantes de Bitcoin y corrige los metadatos del código fuente del paquete.',
    de_DE:
      'Trennt die Gateway-Bindungen für Weboberfläche und JSON-RPC, zentralisiert den gemeinsamen Vertrag der Bitcoin-Varianten und korrigiert die Paketquellmetadaten.',
    pl_PL:
      'Rozdziela powiązania bramy interfejsu WWW i JSON-RPC, centralizuje wspólny kontrakt wariantów Bitcoin oraz poprawia metadane źródła pakietu.',
    fr_FR:
      "Sépare les liaisons de passerelle de l'interface Web et de JSON-RPC, centralise le contrat partagé des variantes Bitcoin et corrige les métadonnées de la source du paquet.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
