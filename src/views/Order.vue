<script setup lang="ts">
const onClickLeft = () => { }
</script>
<template>
  <div class="orderContainer">
    <van-nav-bar title="我的拼团订单" left-arrow @click-left="onClickLeft" />
  </div>
</template>
<style lang="less" scoped>
.orderContainer {
  width: 100vw;
  // height: 100vh;
}

:deep(.van-nav-bar__content) {
  height: 88px;
}

:deep(.van-nav-bar__title) {
  height: 31px;
  line-height: 31px;
  font-size: 32px;
  font-family: PingFang SC;
  font-weight: 800;
  color: #000000;
}

:deep(.van-nav-bar__arrow) {
  color: #000000;
  font-size: 51px;
}
</style>