# Wax packages

This Wax subdirectory is responsible for maintaining Wax "extensions", e.g. signers using the pnpm's workspaces strategy

## Building

1. Install dependencies using `pnpm install` - this will automatically install dependencies for all of the package directories from this directory.
2. Build all the packages using `pnpm run build`
3. Now you can either pack: `pnpm run pack` or publish: `pnpm publish -r`. Note: All of the packages will be saved under [`dist`](./dist) directory
