# wax-vue

This template should help get you started developing with Vue 3 in Vite with our wax library.

## Project Setup

```sh
# Change your directory to vue dir
cd examples/ts/vue

# Create a vue project in current directory
pnpm create vue@latest .

# Run through all options

# Install all dependencies
pnpm install

# Add wax library (the dist-tag should be stable)
pnpm add @hiveio/wax@stable
```

### You can use the following code as a template for a simple App.vue code implementing wax

```vue
<template>
  <main>You are using wax version: "{{ version }}"</main>
</template>

<script lang="ts" setup>
import { createWaxFoundation } from '@hiveio/wax';
import { ref, onBeforeMount } from 'vue';

const version = ref<string>();

onBeforeMount(async () => {
  const wax = await createWaxFoundation();

  version.value = wax.getVersion();
});
</script>
```

### Compile and Hot-Reload for Development

Navigate in your browser to the displayed web server location to listen to the project changes

```sh
pnpm dev
```
