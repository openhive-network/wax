# TypeScript wax examples

Every directory here is a standalone app using the wax package built from this repository.
CI runs them through `ts/package.json`'s `examples:*` scripts (`npm run examples` and
`npm run examples:signature-extension` in `ts/`, after building wax), which install each app
with `pnpm install --frozen-lockfile` from its committed `pnpm-lock.yaml`.

## Changing an app's dependencies

Edit its `package.json`, run `pnpm install` in the app's directory and commit the updated
`pnpm-lock.yaml` with it. A frozen install fails on a `package.json` the lockfile doesn't match.

UI frameworks and tooling (React, Next.js, Vue, Nuxt, Tailwind CSS, TypeScript, Playwright, the
`@hiveio` libraries) are referenced as `catalog:<name>`. Their versions come from the app's
`pnpm-workspace.yaml`, a link to the shared catalogs of the hive projects
(`ts/npm-common-config/pnpm-config/pnpm-workspace.yaml`, the common-ci-configuration
submodule), which also pins `@hiveio/beekeeper` through its `overrides:`. They change when that
submodule is bumped; refresh the lockfiles then.

## Using an example outside this repository

After copying an app's directory:

1. Replace the `file:../../../ts…` dependencies (`@hiveio/wax`, `@hiveio/wax-signers-*`) with
   published versions, e.g. `catalog:hiveio-toolset` or the result of `pnpm add @hiveio/wax`.
2. Replace the `pnpm-workspace.yaml` link with a copy of
   [the file it points to](../../ts/npm-common-config/pnpm-config/pnpm-workspace.yaml),
   or replace each `catalog:<name>` with the version listed for it in the `catalogs:` section
   at the top of the app's `pnpm-lock.yaml`.
3. Delete `pnpm-lock.yaml` (it records this repository's paths) and run `pnpm install`.
