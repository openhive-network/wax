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
+    include: [
+      '@hiveio/wax > class-validator',
+      '@hiveio/wax > class-transformer',
+      '@hiveio/wax > long',
+      '@hiveio/wax > events',
+      '@hiveio/wax > reflect-metadata'
+    ]
+  }
})
```

As you can see, we excluded `@hiveio/wax` from the optimized dependencies list, keeping its sub-dependencies optimized. This results in WASM being downloaded from the proper directory during development build.

During production WASM file is automatically copied to the build directory.
