<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { isDark } = useData()

const logoSrc = computed(() => {
  return isDark.value ? '/icon-dark.png' : '/icon-light.png'
})
</script>

<template>
  <img :src="logoSrc" alt="Pulse Logo" class="VPImage logo" />
</template>

<style scoped>
.logo {
  width: 100%;
  height: auto;
  max-width: 400px;
}
</style>
