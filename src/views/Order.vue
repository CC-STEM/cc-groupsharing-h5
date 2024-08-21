<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { GroupSharingCardInfo, MyHistoryOrderInfo } from '@/typing'

import OrderItem from '@/components/Order/OrderItem.vue'
import PageView from '@/components/PageView.vue'
import { getMyGroupSharingList } from '@/services'
import CardDescDetail from '@/components/Card/CardDescDetail.vue'

const curSelectedCard = ref<GroupSharingCardInfo | null>(null)
const showCardDetailSheetOption = ref({
  show: false,
})

const orderList = ref<MyHistoryOrderInfo[]>([])

function clickDetail(curCard: GroupSharingCardInfo) {
  console.log('click---')
  showCardDetailSheetOption.value = { show: true }
  curSelectedCard.value = curCard
}

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
      <OrderItem
        v-for="(item, index) in orderList" :key="index" class="cardItem" :order-info="item"
        @detail-click="clickDetail(item.groupBuyingInfo)"
      />
    </div>
    <CardDescDetail
      v-if="curSelectedCard" v-model:show-option="showCardDetailSheetOption"
      :cur-selected-card="curSelectedCard"
    />
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

:deep(.van-action-sheet) {
  align-items: center;

  .detailTitle {
    max-width: 618px;
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: 800;
    color: #000000;
    margin-top: 39px;
    margin-bottom: 25px;
  }

  .detailDesc {
    max-width: 618px;
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #000000;
    margin-bottom: 97px;
  }
}

:deep(.van-action-sheet__header) {
  font-size: 40px;
  font-family: PingFang SC;
  font-weight: 800;
  color: #000000;
  margin-top: 50px;
  margin-bottom: 43px;
}

:deep(.van-action-sheet__cancel) {
  width: 622px;
  height: 88px;
  // background: linear-gradient(90deg, #FABC4F, #FF3A05);
  border: 1px solid #FF3E07;
  // border-image: linear-gradient(0deg, #FF3E07, #FAB84D) 1 1;
  border-radius: 44px;

  font-size: 30px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #FF460C;
}
</style>
