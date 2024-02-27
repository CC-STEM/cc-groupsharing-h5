<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import PageView from '@/components/PageView.vue'
import { getUserRecommendRank } from '@/services/api'
import type { RecommendRankItem } from '@/typing'

const curRank = ref<RecommendRankItem[]>([])

watchEffect(async () => {
  const { data: { data: rankList } } = await getUserRecommendRank()
  curRank.value = rankList
  // console.log('res2', res2)
})
</script>

<template>
  <PageView :has-nav-bar="true" title="排行榜" />
</template>

<style lang="less" scoped></style>
