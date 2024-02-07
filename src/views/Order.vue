<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { OrderInfo } from '@/typing'
import { ORDER_STATUS_ENUM } from '@/typing'
import Avatar1 from '@/assets/pic1.jpg'
import Avatar2 from '@/assets/pic2.jpg'
import Avatar3 from '@/assets/pic5.jpg'

import OrderItem from '@/components/Order/OrderItem.vue'
import PageView from '@/components/PageView.vue'
import { getMyGroupSharingList } from '@/services'

const orderList = ref<OrderInfo[]>([{
  card: {
    isActiveStyle: true,
    name: '会员卡名称',
    endTime: '2023.4.20 15:00 截止',
    price: 55.00,
    partNum: 2,
    courseNum: 20,
    detail: '详细说明',
    width: 656,
  },
  avatarList: [{
    url: Avatar1,
  }],
  orderStatus: ORDER_STATUS_ENUM.UNCOMPLETED,
}, {
  card: {
    isActiveStyle: true,
    name: '会员卡名称',
    endTime: '2023.4.20 15:00 截止',
    price: 55.00,
    partNum: 2,
    courseNum: 20,
    detail: '详细说明',
    width: 656,
  },
  avatarList: [{
    url: Avatar2,
  }],
  orderStatus: ORDER_STATUS_ENUM.COMPLETED,
}, {
  card: {
    isActiveStyle: true,
    name: '会员卡名称',
    endTime: '2023.4.20 15:00 截止',
    price: 55.00,
    partNum: 2,
    courseNum: 20,
    detail: '详细说明',
    width: 656,
  },
  avatarList: [{
    url: Avatar3,
  }],
  orderStatus: ORDER_STATUS_ENUM.INVALID,
}])

watchEffect(async () => {
  const res = await getMyGroupSharingList()
  console.log('getMyGroupSharingList', res)
})
</script>

<template>
  <!-- <div class="orderContainer"> -->
  <!-- <van-nav-bar title="我的拼团订单" left-arrow @click-left="onClickLeft" /> -->
  <PageView :has-nav-bar="true" title="我的拼团订单">
    <div class="cardContainer">
      <OrderItem
        v-for="(item, index) in orderList" :key="index" class="cardItem" :card="item.card"
        :avatar-list="item.avatarList" :order-status="item.orderStatus"
      />
    </div>
  </PageView>
  <!-- </div> -->
</template>

<style lang="less" scoped>
// .orderContainer {
//   width: 100vw;

// height: 100vh;
.cardContainer {
  display: flex;
  flex-direction: column;
  align-items: center;

  .cardItem {
    margin: 30px 0;
  }
}

// }
</style>
