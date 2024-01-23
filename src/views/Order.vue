<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { OrderInfo } from '@/typing'
import { ORDER_STATUS_ENUM, ORDER_STATUS_CN_MAP, ORDER_OP_TEXT } from '@/typing'
import Avatar1 from '@/assets/pic1.jpg'
import Avatar2 from '@/assets/pic2.jpg'
import Avatar3 from '@/assets/pic5.jpg'

import OrderItem from '@/components/Order/OrderItem.vue'
const router = useRouter()
const orderList = ref<OrderInfo[]>([{
  card: {
    isActiveStyle: true,
    name: '会员卡名称',
    endTime: '2023.4.20 15:00 截止',
    price: 55.00,
    partNum: 2,
    courseNum: 20,
    detail: '详细说明',
    width: 618,
  },
  avatarList: [{
    url: Avatar1,
  }],
  orderStatus: ORDER_STATUS_ENUM.UNCOMPLETED
}])

function onClickLeft() {
  router.back()
}


</script>

<template>
  <div class="orderContainer">
    <van-nav-bar title="我的拼团订单" left-arrow @click-left="onClickLeft" />
    <order-item :card="item.card" :avatar-list="item.avatarList" :order-status="item.orderStatus"
      v-for="item in orderList"></order-item>
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
