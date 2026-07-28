# Wasabi Wallet

## Documentation

- [Wasabi documentation](https://docs.wasabiwallet.io/) — the official user
  guide and privacy documentation.
- [Wallet recovery](https://docs.wasabiwallet.io/using-wasabi/WalletRecovery.html)
  — how recovery words, wallet files, and passphrases work.
- [Bitcoin full-node integration](https://docs.wasabiwallet.io/using-wasabi/BitcoinFullNode.html)
  — how Wasabi uses a connected node.
- [JSON-RPC interface](https://docs.wasabiwallet.io/using-wasabi/RPC.html) —
  RPC configuration, authentication, and available methods.

## What you get on StartOS

The **Web UI** opens a private Linux desktop with Wasabi preinstalled. Your
desktop home directory, Wasabi wallets, settings, and logs are stored on
persistent StartOS volumes.

Wasabi automatically connects to a compatible Bitcoin service on the same
StartOS server when one is available. This works with StartOS flavors sharing
the `bitcoind` identity, including Bitcoin Core and Bitcoin Knots. An
authenticated **JSON-RPC** interface is also available when enabled.

This service uses the StartOS package ID `wasabi`. A legacy installation with
the `wasabi-webtop` ID is a separate service and does not upgrade into this one
automatically.

## Getting set up

1. Complete the required **Settings** task.
2. Keep the generated Webtop username and password, or replace them with your
   own.
3. Leave **Automatic Local Bitcoin Node** selected. Wasabi starts with its
   upstream P2P synchronization when no compatible Bitcoin service is present
   and switches to the local node automatically when one becomes available.
4. Leave **Apply Settings on Startup** enabled unless you want to manage the
   node, Tor, and JSON-RPC settings inside Wasabi yourself.
5. Save the settings, start the service, and open **Web UI**.
6. Sign in with the Webtop credentials and create or recover a wallet in
   Wasabi.
7. Record the recovery words and wallet passphrase separately from your
   StartOS backup. Both may be required to recover and spend from the wallet.

## Using Wasabi Wallet

### Web UI

Your browser first asks for the Webtop username and password. Run **Show UI
Credentials** whenever you need to retrieve them.

Only files inside the Webtop home folder are persistent. Wasabi stores its
wallet files, settings, and logs there automatically.

### Local Bitcoin node

With **Automatic Local Bitcoin Node** selected, StartOS follows the installed
`bitcoind` flavor's live RPC binding and assigned port, creates a dedicated RPC
user, and keeps Wasabi's endpoint current. This supports compatible flavors
such as Bitcoin Core and Bitcoin Knots, including after switching between them.
You may be prompted to approve required node settings before Wasabi can
connect. Choose **Do Not Use a Local Bitcoin Node** in **Settings** only when
you want Wasabi to use its upstream network behavior exclusively.

### JSON-RPC

Enable JSON-RPC in **Settings** and save the generated RPC credentials. The
**JSON-RPC** interface then appears separately from the Web UI. Use the
interface address together with those RPC credentials. Its gateway addresses
are managed independently from the Web UI addresses.

The **Use Tor in Wasabi** setting controls Wasabi's bundled Tor process. It does
not control which StartOS addresses are enabled for the Web UI or JSON-RPC
interfaces.

## Limitations

This package requires an `x86_64` StartOS server. Cameras and USB devices are
not available inside the browser desktop.
