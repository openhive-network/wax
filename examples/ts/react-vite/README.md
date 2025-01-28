# React + Vite

Inspired by [React + Vite Minimal setup](https://vite.new/react)

[src/App.jsx](src/App.jsx) file was modified.

Important note!:

__**When importing Wax in Vite, remember to import dedicated Vite bundle everywhere in your project: `@hiveio/wax/vite`**__

## WASM-related Vite issues

Internal Note:

Vite currently does not fully support .WASM files as described [here](https://vite.dev/guide/features#webassembly), so we had to create some workarounds

* https://github.com/rustwasm/wasm-pack/issues/1106#issuecomment-2237247752
* https://stackoverflow.com/a/79204138
* https://github.com/vitejs/vite/issues/10761#issuecomment-1334844871
* https://vite.dev/guide/assets#explicit-url-imports
* https://www.npmjs.com/package/vite-plugin-wasm
