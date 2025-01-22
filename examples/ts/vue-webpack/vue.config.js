const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      path: false,
      module: false,
      crypto: false
    };
  }
})
