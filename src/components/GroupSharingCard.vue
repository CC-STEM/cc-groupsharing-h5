<script setup lang="ts">
import { computed } from 'vue'
import type { Card } from '@/typing'
import ValidCardBackImg from '@/assets/validCard.png'
import InValidCardBackImg from '@/assets/invalidCard.png'
import { px2vw } from '@/utils/calcStyle'

const props = defineProps<Card>()
const curEmit = defineEmits(['detailClick']);
const realWidth = computed(() => px2vw(props.width || 656))
const realHeight = computed(() => px2vw(props.height || 285))
const backImgUrl = computed(() => props.isActiveStyle ? `url(${ValidCardBackImg})` : `url(${InValidCardBackImg})`)


</script>

<template>
  <div class="cardBox">
    <div class="cardName">
      <div class="name">会员卡名称</div>
      <div class="endTime">2023.04.20 15:00截止</div>
    </div>
    <div class="cardAmount">
      <div class="price">￥ 55.00</div>
      <div class="joinNum">2人拼</div>
    </div>
    <div class="course">
      <div class="num">常规课 20 次</div>
      <div class="desc" @click="() => curEmit('detailClick')">详情说明</div>
    </div>
  </div>
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
  position: relative;

  .cardName {
    position: absolute;
    top: 28px;
    left: 25px;

    .name {
      font-size: 36px;
      font-family: PingFang SC;
      font-weight: 800;
      color: #FFFFFF;
    }

    .endTime {
      width: 308px;
      height: 38px;
      background: #FAA75D;
      border-radius: 19px;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 800;
      color: #FFFFFF;
      text-align: center;
      margin-top: 13px;
    }
  }

  .cardAmount {
    position: absolute;
    top: 33px;
    right: 29px;

    .price {
      line-height: 48px;
      font-size: 50px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
    }

    .joinNum {
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 800;
      color: #FFFFFF;
      text-align: right;
    }
  }

  .course {
    position: absolute;
    bottom: 20px;
    right: 20px;

    .num {
      height: 23px;
      display: inline-block;
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      margin-right: 29px;
    }

    .desc {
      height: 23px;
      display: inline-block;
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
    }
  }
}
</style>
