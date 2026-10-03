# Sourced from ts/ by the .aidev suite scripts: make ts/node_modules match
# ts/pnpm-lock.yaml, offline, from the image's store. A marker records the
# lockfile and Node it was installed for; it is written only after an install
# that succeeded, and an install whose tools don't resolve is redone.
lock_id="$(sha256sum pnpm-lock.yaml | cut -d' ' -f1) $(node --version)"
marker=node_modules/.aidev-pnpm-lock
tools_present() {
    [ -e node_modules/.bin/tsc ] && [ -e node_modules/.bin/rollup ] \
        && [ -e node_modules/.bin/playwright ] && [ -e node_modules/.bin/protoc-gen-ts_proto ]
}
if [ "$(cat "$marker" 2>/dev/null)" != "$lock_id" ] || ! tools_present; then
    echo "node_modules is not current for pnpm-lock.yaml: pnpm install --offline" >&2
    # HUSKY=0: `prepare`-style hooks must not touch git (a workflow container has none).
    HUSKY=0 pnpm install --offline --frozen-lockfile < /dev/null || return 1
    tools_present || { echo "pnpm install left no tsc/rollup/playwright/protoc-gen-ts_proto" >&2; return 1; }
    printf '%s\n' "$lock_id" > "$marker.tmp" && mv "$marker.tmp" "$marker"
fi
