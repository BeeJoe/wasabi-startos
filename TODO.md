# Wasabi package release checklist

- [x] Build the x86 package and inspect the resulting manifest.
- [x] Install on the authorized StartOS test servers and complete initial
      configuration.
- [x] Verify Webtop authentication locally and Wasabi startup on StartOS.
- [x] Verify automatic local Bitcoin configuration and connectivity with the
      Bitcoin Core flavor.
- [x] Verify automatic local Bitcoin configuration after switching to the
      Bitcoin Knots flavor.
- [x] Verify JSON-RPC interface enable/disable lifecycle.
- [x] Verify JSON-RPC authentication over an enabled gateway address.
- [x] Verify wallet/config persistence across an upgrade and service-container
      rebuild.
- [x] Run a backup and restore sanity check.
- [x] Obtain authorization before uninstall/reinstall testing.
- [ ] Upgrade the StartOS SDK when a release newer than `2.0.9` fixes its
      bundled `brace-expansion` / `js-yaml` audit findings and the missing
      `@start9labs/start-core` package version metadata.
