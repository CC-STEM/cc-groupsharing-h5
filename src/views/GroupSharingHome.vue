<script setup lang="ts">
import type { Card } from '@/typing'
import { ref, onMounted } from 'vue'
import GroupSharingCard from '@/components/GroupSharingCard.vue'
import BScroll from '@better-scroll/core'

const shopName = ref('门店名称AAA')
const groupSharingStatus = ref('开团中')
const cardList = ref<Card[]>([{
  isActiveStyle: true,
  name: '会员卡名称',
  endTime: '2023.4.20 15:00 截止',
  price: 55.00,
  partNum: 2,
  courseNum: 20,
  detail: '详细说明',
  width: 618,
}, {
  isActiveStyle: true,
  name: '会员卡名称',
  endTime: '2023.4.20 15:00 截止',
  price: 55.00,
  partNum: 2,
  courseNum: 20,
  detail: '详细说明',
  width: 618,
}, {
  isActiveStyle: true,
  name: '会员卡名称',
  endTime: '2023.4.20 15:00 截止',
  price: 55.00,
  partNum: 2,
  courseNum: 20,
  detail: '详细说明',
  width: 618,
}])

const scrollRef = ref(null)

onMounted(() => {
  console.log(scrollRef.value)
  const scrollIns = new BScroll(scrollRef.value, {
    probeType: 3,
    scrollX: true,
  })

  scrollIns.on('scrollStart', () => {
    console.log('scrollStart-')
  })
  scrollIns.on('scroll', ({ y }) => {
    console.log('scrolling-', y)
  })
  scrollIns.on('scrollEnd', (pos) => {
    console.log(pos)
  })
  console.log('scroll', -(document.querySelector('.subContainer').clientWidth - document.querySelector('.cardContainer').clientWidth))
  scrollIns.scrollTo(-(document.querySelector('.subContainer').clientWidth - document.querySelector('.cardContainer').clientWidth) / 2, 0)
})
</script>
<template>
  <div class="container">
    <div class="header">
      <img class="adImg" src="@/assets/ad.png" />
      <div class="sharingBar">
        <div class="left">
          <span>{{ shopName }}</span>
        </div>
        <div class="right">
          <span>{{ groupSharingStatus }}</span>
        </div>
      </div>
      <div class="cardContainer" ref="scrollRef">
        <div class="subContainer">
          <group-sharing-card v-for="item in cardList" :is-active-style="item.isActiveStyle" :course-num="item.courseNum"
            :end-time="item.endTime" :width="item.width" :name="item.name" :detail="item.detail" :part-num="item.partNum"
            :price="item.price"></group-sharing-card>
        </div>
      </div>
    </div>
    <div class="content"></div>
  </div>
</template>
<style lang="less" scoped>
.container {
  width: 750px;
  // width: 100vw;
  height: 2281px;
  position: relative;
  background-image: url('@/assets/shareBackgroundTop.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .header {
    height: 30%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .adImg {
      width: 100%;
    }

    .sharingBar {
      width: 695px;
      height: 71.6px;
      background: #FFFFFF;
      border-radius: 36px;
      display: flex;

      .left {
        position: relative;
        width: 500px;
        height: 100%;
        background: #E43E12;
        border-bottom-left-radius: 36px;
        border-top-left-radius: 36px;
        display: flex;
        align-items: center;

        span {
          margin-left: 40px;
          font-size: 32px;
          font-family: PingFang SC;
          font-weight: 800;
          color: #FFFFFF;
        }
      }

      .left::after {
        content: ' ';
        position: absolute;
        top: 0;
        right: -35px;
        border-width: 71.6px 35px;
        border-style: solid;
        border-color: #E43E12 transparent transparent transparent;
      }

      .right {
        height: 100%;
        width: calc(100% - 500px);
        display: flex;
        align-items: center;
        justify-content: center;

        span {
          font-size: 36px;
          font-family: youshe;
          font-weight: 400;
          color: #E43E12;
        }
      }
    }

    .cardContainer {
      white-space: nowrap;
      width: 100%;
      overflow-x: scroll;
      height: 336px;

      .subContainer {
        float: left;
        // position: absolute;
        height: 336px;
        display: flex;
        // float: left;
        align-items: center;
        // margin: auto;
        // left: -50%;
        // justify-content: center;
      }
    }
  }

  .content {
    height: 70%;
    background-image: url('@/assets/shareBackground.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}
</style>
