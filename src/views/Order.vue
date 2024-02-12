<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { MyHistoryOrderInfo } from '@/typing'

import OrderItem from '@/components/Order/OrderItem.vue'
import PageView from '@/components/PageView.vue'
import { getMyGroupSharingList } from '@/services'

const orderList = ref<MyHistoryOrderInfo[]>([])

watchEffect(async () => {
  const { data: { data } } = await getMyGroupSharingList()
  console.log('getMyGroupSharingList', data)
  orderList.value = data
})
</script>

<template>
  <!-- <div class="orderContainer"> -->
  <!-- <van-nav-bar title="我的拼团订单" left-arrow @click-left="onClickLeft" /> -->
  <PageView :has-nav-bar="true" title="我的拼团订单">
    <div class="cardContainer">
      <OrderItem v-for="(item, index) in orderList" :key="index" class="cardItem" :order-info="item" />
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
