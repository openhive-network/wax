# vue-webpack

Created by command: `pnpm create vue@latest .`

[src/App.vue](src/App.vue) file was modified.

Important note!:

__**When importing Wax in Vite, remember to import dedicated Vite bundle everywhere in your project: `@hiveio/wax/vite`**__

Changes made in order for Vue + Vite to work:

```diff
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
+ import wasm from "vite-plugin-wasm";
+ import topLevelAwait from "vite-plugin-top-level-await";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
+   wasm(),
+   topLevelAwait()
  ]
})
```

Vite currently does not fully support .WASM files as described [here](https://vite.dev/guide/features#webassembly), so we have to use recommended plugin [vite-plugin-wasm](https://www.npmjs.com/package/vite-plugin-wasm)

## WASM-related Vite issues

* https://github.com/rustwasm/wasm-pack/issues/1106#issuecomment-2237247752
* https://stackoverflow.com/a/79204138
* https://github.com/vitejs/vite/issues/10761#issuecomment-1334844871
* https://vite.dev/guide/assets#explicit-url-imports
