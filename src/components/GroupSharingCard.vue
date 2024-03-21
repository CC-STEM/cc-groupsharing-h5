<script setup lang="ts">
import { computed, watch, watchEffect } from 'vue'
import type { GroupSharingCardInfo } from '@/typing'
import ValidCardBackImg from '@/assets/validCard.png'
import InValidCardBackImg from '@/assets/invalidCard.png'
import { px2vw } from '@/utils/calcStyle'
import { calcProgressByCardInfo, transformDateString } from '@/utils/index'

const props = defineProps<{ cardInfo: GroupSharingCardInfo, isActiveStyle?: boolean }>()
const curEmit = defineEmits(['detailClick'])
const realWidth = computed(() => px2vw(props.cardInfo?.width || 656))
const realHeight = computed(() => px2vw(props.cardInfo?.height || 285))
const backImgUrl = computed(() => props.isActiveStyle ? `url(${ValidCardBackImg})` : `url(${InValidCardBackImg})`)
const isHundredGroup = computed(() => props.cardInfo?.groupBuyingType === 2) // 百人团
let refreshTimer = null
const curHundredGroupProgressInfo = ref<{ percent: number, remain: string } | null>(null)

watchEffect(() => {
  curHundredGroupProgressInfo.value = calcProgressByCardInfo(props.cardInfo)
})

watch(() => props.cardInfo, (newVal) => {
  if (newVal) {
    refreshTimer !== null && clearInterval(refreshTimer)
    refreshTimer = setInterval(() => {
      curHundredGroupProgressInfo.value = calcProgressByCardInfo(newVal)
    }, 10 * 60 * 1000)
  }
  else {
    refreshTimer !== null && clearInterval(refreshTimer)
  }
}, {
  immediate: true,
})
</script>

<template>
  <div class="cardBox">
    <div class="cardName">
      <div class="name">
        {{ props.cardInfo?.vipName }}
      </div>
      <div class="endTime">
        {{ props.cardInfo?.endTime ? transformDateString(props.cardInfo?.endTime) : '' }} 截止
      </div>
    </div>
    <div class="cardAmount">
      <div class="price">
        ￥ {{ props.cardInfo?.price }}
      </div>
      <div v-if="!isHundredGroup" class="joinNum">
        {{ props.cardInfo?.number }}人拼
      </div>
      <div v-else class="hundredText">
        百人团
      </div>
    </div>
    <div v-if="isHundredGroup && curHundredGroupProgressInfo" class="progress">
      <div class="bar">
        <div class="default" />
        <div :style="{ width: `${curHundredGroupProgressInfo.percent}%` }" class="complete" />
      </div>
      <div class="percent">
        {{ curHundredGroupProgressInfo.percent }}%
      </div>
    </div>
    <div class="course">
      <div class="num">
        常规课 {{ props.cardInfo?.lessonNumber }} 次
      </div>
      <div class="desc" @click="() => curEmit('detailClick')">
        详情说明
      </div>
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

    .hundredText {
      width: 96px;
      height: 36px;
      background: rgba(0, 0, 0, 0);
      border-radius: 18px;
      border: 2px solid #FFFFFF;
      text-align: center;
      line-height: 36px;

      font-family: PingFang SC;
      font-weight: 800;
      font-size: 26px;
      color: #FFFFFF;
      margin-top: 12px;
      position: absolute;
      right: 0px;
    }
  }

  .progress {
    width: 304px;
    position: absolute;
    bottom: 77px;
    right: 28px;
    display: flex;
    align-items: center;

    .bar {
      width: 240px;
      height: 18px;
      border-radius: 9px;
      margin-right: 1px;
      background: #CC3F10;
      position: relative;

      // .default {
      //   background: #CC3F10;
      //   width: 100%;
      //   height: 100%;
      //   border-radius: 9px;
      // }

      .complete {
        position: absolute;

        height: 100%;
        background: linear-gradient(180deg, #FFF9E6, #FFB400);
        border-radius: 9px;
      }
    }

    .percent {
      font-family: PingFang SC;
      font-weight: bold;
      font-size: 24px;
      color: #FFFFFF;
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
