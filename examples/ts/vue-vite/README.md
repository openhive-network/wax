# vue-webpack

Created by command: `pnpm create vue@latest .`

[src/App.vue](src/App.vue) file was modified

Changes made in order for Vue + Vite to work:

```diff
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
+  optimizeDeps: { // Affects only dev build
+    exclude: ['@hiveio/wax'],
+  }
})
```

As you can see, we excluded `@hiveio/wax` from the optimized dependencies list. This results in WASM being downloaded from the proper directory during development build.

During production WASM file is automatically copied to the build directory and wax is optimized.
