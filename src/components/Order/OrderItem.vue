import type { ORDER_STATUS_ENUM } from '@/typing';
<script setup lang="ts">
import { computed } from 'vue'
import { closeToast, showLoadingToast, showToast } from 'vant'
import type { MyHistoryOrderInfo } from '@/typing'
import { ORDER_OP_TEXT, ORDER_OP_TEXT_COLOR, ORDER_STATUS_CN_MAP, ORDER_STATUS_ENUM } from '@/typing'
import GroupSharingCard from '@/components/GroupSharingCard.vue'
import JoinGroupAvatarList from '@/components/Card/JoinGroupAvatarList.vue'
import { px2vw } from '@/utils/calcStyle'
import { useWXStateStore } from '@/stores'
import { getLoginInfo } from '@/utils/index'
import { deleteGroupBuyingOrder } from '@/services'

const props = defineProps<{ orderInfo: MyHistoryOrderInfo }>()
const curEmits = defineEmits(['detailClick'])
const curCard = computed(() => props.orderInfo.groupBuyingInfo)
const wxStateStore = useWXStateStore()

const containerWidth = computed(() => px2vw(curCard.value.width || 656))
const orderStatus = computed(() => ORDER_STATUS_CN_MAP[props.orderInfo.status])
const orderBtnText = computed(() => ORDER_OP_TEXT[props.orderInfo.status])
const orderTextColor = computed(() => ORDER_OP_TEXT_COLOR[props.orderInfo.status])

async function handleOp() {
  // 当前订单为未拼成，提示邀请
  if (props.orderInfo.status === ORDER_STATUS_ENUM.UNCOMPLETED) {
    if (wxStateStore.wx) {
      let shareLink = `${window.location.origin}/groupsharing`
      const loginInfo = getLoginInfo()
      if (loginInfo.name)
        shareLink += `?shareUser=${loginInfo.name}`

      if (props.orderInfo.id)
        shareLink += `&groupBuyingOrderId=${props.orderInfo.id}`
      showLoadingToast({
        message: '生成分享链接中...',
        loadingType: 'spinner',
        duration: 0,
      })
      console.log('订单内分享链接', shareLink)
      Promise.all([new Promise((resolve) => {
        // 自定义分享
        wxStateStore.wx.updateAppMessageShareData({
          imgUrl: 'https://jkc-1313504415.cos.ap-shanghai.myqcloud.com/wxh5_static%2FsharePic.png',
          link: shareLink,
          desc: '拼团活动期间，用户可在公众号网页发起拼团',
          title: '邀好友一起拼',
          success() {
            console.log('设置朋友分享成功')
            resolve(true)
          },
        })
      }), new Promise((resolve) => {
        wxStateStore.wx.updateTimelineShareData({
          imgUrl: 'https://jkc-1313504415.cos.ap-shanghai.myqcloud.com/wxh5_static%2FsharePic.png',
          link: shareLink,
          title: '邀好友一起拼',
          success() {
            console.log('设置朋友圈分享成功')
            resolve(true)
          },
        })
      })]).then(() => {
        closeToast()
        showToast('请点击页面右上角 ... 发起分享')
      })
    }
  }
  // 当前订单为已拼成，提示去使用
  if (props.orderInfo.status === ORDER_STATUS_ENUM.COMPLETED)
    showToast('请前往门店使用')

  // 当前订单为已失效，操作删除
  if (props.orderInfo.status === ORDER_STATUS_ENUM.INVALID) {
    await deleteGroupBuyingOrder({
      id: props.orderInfo.id,
    })
    showToast('订单删除成功')
  }
}
</script>

<template>
  <div class="orderItemContainer">
    <GroupSharingCard
      class="orderSharingCard" :is-active-style="props.orderInfo.status !== ORDER_STATUS_ENUM.INVALID"
      :card-info="curCard" @detail-click="curEmits('detailClick')"
    />
    <div class="opBox">
      <div class="opAvatar">
        <JoinGroupAvatarList
          :avatar-margin="3" :avatar-height="66" :avatar-width="66" :number="curCard.number"
          :current-number="props.orderInfo.currentNumber"
        />
        <div class="orderStatus">
          {{ orderStatus }}
        </div>
      </div>
      <div class="opBtn" @click="handleOp">
        {{ orderBtnText }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.orderItemContainer {
  height: 420px;
  width: v-bind(containerWidth);
  // width: 656px;
  background: #FFFFFF;
  border-radius: 30px;

  .opBox {
    // width: 656px;
    height: 135px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .opAvatar {
      width: auto;
      display: flex;
      align-items: center;

      .orderStatus {
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 800;
        color: v-bind(orderTextColor);
      }
    }

    .opBtn {
      width: 183px;
      height: 76px;
      background: v-bind("props.orderInfo.status === ORDER_STATUS_ENUM.COMPLETED || props.orderInfo.status === ORDER_STATUS_ENUM.UNCOMPLETED ? '#000000' : '#FFFFFF'");
      border-radius: 38px;
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 800;
      color: v-bind("props.orderInfo.status === ORDER_STATUS_ENUM.COMPLETED || props.orderInfo.status === ORDER_STATUS_ENUM.UNCOMPLETED ? '#FFFFFF' : '#000000'");
      display: flex;
      justify-content: center;
      align-items: center;
      border: v-bind("props.orderInfo.status === ORDER_STATUS_ENUM.INVALID ? '2px solid #D1D1D1' : 'none'")
    }
  }
}
</style>
