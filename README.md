<p align="center">
  <img src="icon.png" alt="Wasabi Wallet Logo" width="21%" />
</p>

# Wasabi Wallet on StartOS

> **Upstream docs:** <https://docs.wasabiwallet.io/>
>
> Everything not listed here should behave the same as upstream Wasabi Wallet.

This package runs [Wasabi Wallet](https://github.com/WalletWasabi/WalletWasabi)
inside a browser-accessible Linux desktop, based on the work in
[remcoros/wasabi-webtop-startos](https://github.com/remcoros/wasabi-webtop-startos).

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions](#actions)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

## Image and Container Runtime

The package uses the custom Wasabi Webtop image published by the reference
package maintainer. It is available for `x86_64` only.

The image's default entrypoint starts s6-overlay and Selkies Webtop. StartOS runs
that entrypoint as PID 1 and supplies the Webtop user, password, title, UID, GID,
and timezone through environment variables. Hardware acceleration is enabled
when compatible graphics hardware is available.

## Volume and Data Layout

| StartOS volume | Container mount | Contents |
| --- | --- | --- |
| `main` | `/root/data` | StartOS-managed package settings and generated Bitcoin RPC credentials |
| `userdir` | `/config` | Webtop home directory, Wasabi wallets, Wasabi settings, and logs |

Wasabi's Linux data directory is `/config/.walletwasabi/client`. Files written
outside `/config` and `/root/data` are part of the disposable container
filesystem.

## Installation and First-Run Flow

A critical setup task requires the **Settings** action to be saved before the
service can start. The form creates Webtop credentials and defaults to
automatically using a compatible Bitcoin service on the same StartOS server.

The `bitcoind` package ID can be provided by any compatible StartOS flavor,
including Bitcoin Core and Bitcoin Knots. When that provider's RPC binding is
available, the package resolves its live bridge address, creates dedicated RPC
credentials, and asks the provider to enable compact block filters. If a
Bitcoin provider is installed later, switched to another flavor, or receives a
new assigned port, the reactive address lookup heals automatically. Wasabi's
upstream first-run wizard is skipped and its window opens maximized inside
Webtop.

The StartOS package ID is `wasabi`. Builds previously published with the
`wasabi-webtop` ID are treated by StartOS as a separate service and do not
upgrade in place.

## Configuration Management

| StartOS-managed | Wasabi-managed |
| --- | --- |
| Webtop title and login | Wallet creation and recovery |
| Automatic local Bitcoin RPC endpoint and credentials | Wallet passphrases |
| Wasabi's bundled Tor toggle | Wallet behavior not represented by the Settings action |
| JSON-RPC enablement and credentials | All node, Tor, and RPC settings when **Apply Settings on Startup** is disabled |

When StartOS management is enabled, the package merges only the managed fields
into Wasabi's existing JSON files. Unmanaged Wasabi settings are preserved.

## Network Access and Interfaces

Each interface has its own StartOS host and gateway binding:

| Interface | Host ID | Internal port | Protocol | Availability |
| --- | --- | ---: | --- | --- |
| Web UI | `ui` | `3000` | HTTP behind StartOS TLS termination | Always |
| JSON-RPC | `rpc` | `37128` | HTTP behind StartOS TLS termination | Only when enabled in **Settings** |

The Web UI is protected by the Webtop username and password. JSON-RPC uses its
own Basic Authentication credentials. Separate bindings let the user choose
gateway addresses for each interface independently.

## Actions

- **Settings** — configures Webtop access, optional local Bitcoin integration,
  Wasabi's bundled Tor process, and the optional JSON-RPC server.
- **Show UI Credentials** — displays the current Webtop username and password.

## Backups and Restore

StartOS backs up both `main` and `userdir` while the service is stopped. This
includes the package configuration, Webtop home directory, Wasabi wallet files,
settings, and logs. Restore uses the standard volume restore flow and does not
regenerate wallet material.

Recovery words and wallet passphrases must still be stored independently; they
are not substitutes for one another.

## Health Checks

The primary daemon checks the Webtop HTTP endpoint on port `3000`. StartOS
reports the service ready when the endpoint responds.

## Dependencies

A compatible local Bitcoin service is optional. StartOS flavors such as Bitcoin
Core and Bitcoin Knots share the `bitcoind` package ID and provider contract.
When selected, the package:

- resolves the active flavor's live bridge address and assigned port through the
  current StartOS host-binding API;
- provisions a dedicated RPC user;
- requires compact block filters to be enabled; and
- writes the endpoint and credentials into Wasabi's configuration.

Automatic local-node use is the default. While no compatible `bitcoind` flavor
is installed, Wasabi uses its upstream P2P synchronization behavior. When a
provider becomes available or the user switches flavors, the package adopts
its RPC endpoint without requiring a hard-coded hostname, port, or settings
change. Users can explicitly opt out in **Settings**.

## Limitations and Differences

1. Only `x86_64` StartOS servers are supported by the published image.
2. Wasabi runs through a browser desktop rather than as a native desktop
   application.
3. Cameras and USB devices are not passed through to the Webtop session.
4. Only files under the mounted persistent paths survive a container rebuild.

## What Is Unchanged from Upstream

Wallet creation, recovery, transaction handling, coin control, synchronization,
and wallet passphrase behavior follow the upstream Wasabi documentation.

## Contributing

See [AGENTS.md](AGENTS.md) for the package development workflow.

## Quick Reference for AI Consumers

```yaml
package_id: wasabi
architectures: [x86_64]
volumes:
  main: /root/data
  userdir: /config
ports:
  web_ui: 3000
  json_rpc: 37128
dependencies: [bitcoind_optional]
startos_managed_env_vars:
  - PUID
  - PGID
  - TZ
  - TITLE
  - CUSTOM_USER
  - PASSWORD
actions:
  - config
  - ui-credentials
```
