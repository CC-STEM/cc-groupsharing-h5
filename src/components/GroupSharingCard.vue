<script setup lang="ts">
import { computed } from 'vue'
import type { Card } from '@/typing'
import ValidCardBackImg from '@/assets/validCard.png'
import InValidCardBackImg from '@/assets/invalidCard.png'
import { px2vw } from '@/utils/calcStyle'

const props = defineProps<Card>()
const realWidth = computed(() => px2vw(props.width || 656))
const realHeight = computed(() => px2vw(props.height || 285))
const backImgUrl = computed(() => props.isActiveStyle ? `url(${ValidCardBackImg})` : `url(${InValidCardBackImg})`)
</script>

<template>
  <div class="cardBox" />
</template>

<style lang="less" scoped>
.cardBox {
  display: inline-block;
  width: v-bind(realWidth);
  height: v-bind(realHeight);
  background-image: v-bind(backImgUrl);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin: 0 15px;
}
</style>
