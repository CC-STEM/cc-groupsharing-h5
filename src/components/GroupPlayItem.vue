<script setup lang="ts">
import type { PlayItem } from '@/typing'

const props = defineProps<PlayItem>()
</script>

<template>
  <div class="playBox">
    <img class="logo" :src="props.imgUrl" alt="">
    <div class="title">
      {{ props.title }}
    </div>
    <div class="subTitle">
      {{ props.subTitle }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.playBox {
  width: auto;
  height: 172px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .logo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: 30px;
  }

  .title {
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #171717;
  }

  .subTitle {
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #A0A0A0;
  }
}
</style>
