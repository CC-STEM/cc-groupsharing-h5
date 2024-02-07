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
    id: 1706177382872472,
    storeName: '',
    vipName: '会员卡1111',
    startTime: '2024-01-22',
    endTime: '2024-01-25',
    price: 500.00,
    groupBuyingPrice: 420.00,
    deadline: 30,
    number: 2,
    lessonNumber: 4,
    details: '详情说明详情说明详情说明详情说明详情说明详情说明',
    shareTitle: '主标题文案',
    shareSubTitle: '副标题文案',
    shareImgUrl: 'https://cc-web-1313504415.cos.ap-shanghai.myqcloud.com/web_pc/2024-01-25/20240125180919_22022312542M617_0_lp.jpg',
    rules: 'https://cc-web-1313504415.cos.ap-shanghai.myqcloud.com/web_pc/2024-02-02/20240202171159_微信图片_20240202171056.jpg',
  },
  avatarList: [{
    url: Avatar1,
  }],
  orderStatus: ORDER_STATUS_ENUM.UNCOMPLETED,
}, {
  card: {
    id: 1706177382872472,
    storeName: '',
    vipName: '会员卡1111',
    startTime: '2024-01-22',
    endTime: '2024-01-25',
    price: 500.00,
    groupBuyingPrice: 420.00,
    deadline: 30,
    number: 2,
    lessonNumber: 4,
    details: '详情说明详情说明详情说明详情说明详情说明详情说明',
    shareTitle: '主标题文案',
    shareSubTitle: '副标题文案',
    shareImgUrl: 'https://cc-web-1313504415.cos.ap-shanghai.myqcloud.com/web_pc/2024-01-25/20240125180919_22022312542M617_0_lp.jpg',
    rules: 'https://cc-web-1313504415.cos.ap-shanghai.myqcloud.com/web_pc/2024-02-02/20240202171159_微信图片_20240202171056.jpg',
  },
  avatarList: [{
    url: Avatar2,
  }],
  orderStatus: ORDER_STATUS_ENUM.COMPLETED,
}, {
  card: {
    id: 1706177382872472,
    storeName: '',
    vipName: '会员卡1111',
    startTime: '2024-01-22',
    endTime: '2024-01-25',
    price: 500.00,
    groupBuyingPrice: 420.00,
    deadline: 30,
    number: 2,
    lessonNumber: 4,
    details: '详情说明详情说明详情说明详情说明详情说明详情说明',
    shareTitle: '主标题文案',
    shareSubTitle: '副标题文案',
    shareImgUrl: 'https://cc-web-1313504415.cos.ap-shanghai.myqcloud.com/web_pc/2024-01-25/20240125180919_22022312542M617_0_lp.jpg',
    rules: 'https://cc-web-1313504415.cos.ap-shanghai.myqcloud.com/web_pc/2024-02-02/20240202171159_微信图片_20240202171056.jpg',
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
