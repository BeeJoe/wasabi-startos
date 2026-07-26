ARCHES := x86
# overrides to s9pk.mk must precede the include statement
include node_modules/@start9labs/start-sdk/s9pk.mk

# start-cli preserves ingredient permissions. Normalize them so packages built
# under a restrictive umask remain readable inside StartOS's user namespace.
.PHONY: package-permissions
package-permissions: javascript/index.js
	chmod -R a+rX javascript assets
	chmod a+r icon.png LICENSE instructions.md

$(BASE_NAME)_x86_64.s9pk: package-permissions
