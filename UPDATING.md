# Updating the upstream version

The package wraps the Wasabi Webtop image published by
`remcoros/wasabi-webtop-startos`. The upstream Wasabi release and Docker image
version are kept together in `WASABI_VERSION` in
`startos/versions/current.ts`.

## Determining the upstream version

1. Read the latest stable Wasabi release:

   ```sh
   gh release view --repo WalletWasabi/WalletWasabi --json tagName -q .tagName
   ```

2. Confirm that the matching Webtop image tag exists:

   ```sh
   docker buildx imagetools inspect ghcr.io/remcoros/wasabi-webtop:<version>
   ```

3. Inspect the manifest before changing the package architectures. A
   single-image Docker V2 manifest currently supports only `linux/amd64`; do
   not add ARM unless the registry publishes and runtime testing confirms it.

4. Confirm the binary bundled in the image:

   ```sh
   docker run --rm --platform linux/amd64 \
     --entrypoint wassabee \
     ghcr.io/remcoros/wasabi-webtop:<version> --version
   ```

## Applying the bump

1. Edit `WASABI_VERSION` and `current.version` in
   `startos/versions/current.ts`.
2. Reset the downstream revision to `:0` when the Wasabi application version
   changes. Increment only the downstream revision when the image or package
   changes without an upstream version change.
3. Update localized release notes in the same file.
4. Do not create a historical version file unless an actual migration must run
   sequentially.
5. Reinspect the image entrypoint, exposed ports, default configuration files,
   and persisted paths.
6. Run `npm run check`, `npm run build`, `make x86`, artifact inspection, and
   the runtime checks in `TODO.md`.
