<template>
  <main>You are using wax version: "{{ version }}"</main>
</template>

<script setup>
import { createWaxFoundation } from '@hiveio/wax';
import { ref, onBeforeMount } from 'vue';

const version = ref();

// Initialize waxLoaded to undefined to signal loading in progress
// This prevents race conditions where tests check the flag before async code runs
window.waxLoaded = undefined;

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