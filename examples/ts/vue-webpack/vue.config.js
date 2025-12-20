const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    module: {
      rules: [
        {
          // Handle .wasm?url imports as asset/resource (emit file and return URL)
          resourceQuery: /url/,
          type: 'asset/resource'
        }
      ]
    }
  }
})
