# vue-webpack

Created by command: `vue create vue-webpack` ([`@vue/cli` package](https://www.npmjs.com/package/@vue/cli))

[src/App.vue](src/App.vue) file was modified

Changes made in order for Vue + Webpack to work:

```diff
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
+  configureWebpack: config => {
+    config.resolve.fallback = {
+      fs: false,
+      path: false,
+      module: false,
+      crypto: false
+    };
+  }
})
```

As you can see, we had to extend webpack configuration, ensuring `fs`, `path`, `module` and `crypto` dependencies are omitted from bundling as code importing them will be unreachable on the client-web-side
