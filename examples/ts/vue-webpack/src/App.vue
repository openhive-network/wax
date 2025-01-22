<template>
  <main>You are using wax version: "{{ version }}"</main>
</template>

<script setup>
import { createWaxFoundation } from '@hiveio/wax';
import { ref, onBeforeMount } from 'vue';

const version = ref();

onBeforeMount(async () => {
  const wax = await createWaxFoundation();

  version.value = wax.getVersion();
});
</script>
