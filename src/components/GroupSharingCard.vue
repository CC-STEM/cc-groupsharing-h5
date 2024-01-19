<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Card } from '@/typing'
import ValidCardBackImg from '@/assets/validCard.png'
import InValidCardBackImg from '@/assets/invalidCard.png'

const props = defineProps<Card>()
const realWidth = computed(() => (props.width || 656) + 'px');
const realHeight = computed(() => (props.height || 285) + 'px');
const backImgUrl = computed(() => props.isActiveStyle ? `url(${ValidCardBackImg})` : `url(${InValidCardBackImg})`)
</script>

<template>
  <div class="cardBox">

  </div>
</template>
<style lang="less" scoped>
.cardBox {
  display: inline-block;
  width: 656px;
  height: 285px;
  background-image: v-bind(backImgUrl);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>