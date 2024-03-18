<script setup lang="ts">
import type { ConfigProviderTheme } from 'vant'
import { localStorage } from '@/utils/local-storage'
import { useStore } from '@/stores'

const store = useStore()
const theme = ref<ConfigProviderTheme>('light')
const mode = computed(() => store.mode)

watch(mode, (val) => {
  if (val === 'dark' || localStorage.get('theme') === 'dark') {
    theme.value = 'dark'
    document.querySelector('html')
      .setAttribute('data-theme', 'dark')
  }
  else {
    theme.value = 'light'
    document.querySelector('html')
      .setAttribute('data-theme', 'light')
  }
}, { immediate: true })

provide('isRealDark', computed(() => theme.value === 'dark'))
</script>

<template>
  <VanConfigProvider :theme="theme">
    <RouterView />
  </VanConfigProvider>
</template>

<style lang="less">
.van-floating-bubble {
  width: 130px !important;
  height: 130px !important;
  border-radius: 0 !important;
  background: none !important;

  .van-icon__image {
    width: 100%;
    height: 100%;
  }
}

.van-toast {
  font-size: 30px !important;
  line-height: 30px !important;
}
</style>
