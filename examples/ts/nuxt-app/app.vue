<script setup>
import { createWaxFoundation } from "@hiveio/wax";
import { onBeforeMount } from 'vue';

const version = ref('');

if (process.server) {
  const wax = await createWaxFoundation();

  version.value = wax.getVersion();
} else
onBeforeMount(async () => {
  try {
    const wax = await createWaxFoundation();

    version.value = wax.getVersion();

    window.waxLoaded = true;
  } catch (error) {
    console.error(error);

    window.waxLoaded = false;
  }
});
</script>

<template>
  <div>
    {{ version }}
  </div>
</template>
