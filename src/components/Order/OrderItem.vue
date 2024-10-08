import type { ORDER_STATUS_ENUM } from '@/typing';
<script setup lang="ts">
import { computed } from 'vue'
import { closeToast, showLoadingToast, showSuccessToast } from 'vant'
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
const isHundredGroup = computed(() => curCard.value.groupBuyingType === 2) // 百人团
const wxStateStore = useWXStateStore()

const containerWidth = computed(() => px2vw(curCard.value.width || 656))
const orderStatus = computed(() => ORDER_STATUS_CN_MAP[props.orderInfo.status])
const orderBtnText = computed(() => ORDER_OP_TEXT[props.orderInfo.status])
const orderTextColor = computed(() => ORDER_OP_TEXT_COLOR[props.orderInfo.status])
const showWecom = ref(false)
const showShareArrowOverlay = ref(false)

async function handleOp() {
  // 当前订单为未拼成，提示邀请
  if (props.orderInfo.status === ORDER_STATUS_ENUM.UNCOMPLETED) {
    if (wxStateStore.wx) {
      let shareLink = `${window.location.origin}/groupsharing`
      const loginInfo = getLoginInfo()
      if (loginInfo?.phone)
        shareLink += `?shareUser=${loginInfo.phone}`

      if (props.orderInfo.id)
        shareLink += `&groupBuyingOrderId=${props.orderInfo.id}`
      showLoadingToast({
        message: '生成分享链接中...',
        loadingType: 'spinner',
        duration: 0,
      })
      console.log('订单内分享链接', shareLink)
      Promise.all([new Promise((resolve, reject) => {
        // 自定义分享
        wxStateStore.wx.updateAppMessageShareData({
          imgUrl: curCard.value.shareImgUrl,
          link: shareLink,
          desc: curCard.value.shareSubTitle,
          title: curCard.value.shareTitle,
          success() {
            console.log('设置朋友分享成功')
            resolve(true)
          },
          fail(e) {
            reject(e.errMsg)
          },
        })
      }), new Promise((resolve, reject) => {
        wxStateStore.wx.updateTimelineShareData({
          imgUrl: curCard.value.shareImgUrl,
          link: shareLink,
          title: curCard.value.shareTitle,
          success() {
            console.log('设置朋友圈分享成功')
            resolve(true)
          },
          fail(e) {
            reject(e.errMsg)
          },
        })
      })]).then(() => {
        showShareArrowOverlay.value = true
      }).catch((e) => {
        console.log('订单项设置分享异常', e)
      }).finally(() => {
        closeToast()
      })
    }
  }
  // 当前订单为已拼成或已单买，提示去使用
  if ([ORDER_STATUS_ENUM.COMPLETED, ORDER_STATUS_ENUM.SINGLE_BUY].includes(props.orderInfo.status))
    showWecom.value = true
  // showToast('请前往门店使用')

  // 当前订单为已失效，操作删除
  if (props.orderInfo.status === ORDER_STATUS_ENUM.INVALID) {
    await deleteGroupBuyingOrder({
      id: props.orderInfo.id,
    })
    showSuccessToast('订单删除成功')
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
          :is-hundred="isHundredGroup" :avatar-margin="3" :avatar-height="66" :avatar-width="66"
          :number="curCard.number" :current-number="props.orderInfo.currentNumber"
        />
      </div>
      <div class="orderStatus">
        {{ orderStatus }}
      </div>
      <div class="opBtn" @click="handleOp">
        {{ orderBtnText }}
      </div>
    </div>
    <van-popup v-model:show="showWecom" class="wecomDialog">
      <div class="dialogText">
        请联系门店老师使用
      </div><img v-if="curCard?.wecom" class="wecom" :src="curCard.wecom" alt="">
    </van-popup>
    <van-overlay z-index="1000" :show="showShareArrowOverlay" @click="showShareArrowOverlay = false">
      <img src="@/assets/shareArrow.png" class="shareArrow" alt="">
    </van-overlay>
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
    // justify-content: space-around;
    align-items: center;
    position: relative;

    .opAvatar {
      width: auto;
      display: flex;
      align-items: center;
      position: absolute;
      left: 10px;
    }

    .orderStatus {
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 800;
      color: v-bind(orderTextColor);
      position: absolute;
      right: 200px;
    }

    .opBtn {
      width: 183px;
      height: 76px;
      background: v-bind("[ORDER_STATUS_ENUM.COMPLETED, ORDER_STATUS_ENUM.UNCOMPLETED, ORDER_STATUS_ENUM.SINGLE_BUY].includes(props.orderInfo.status) ? '#000000' : '#FFFFFF'");
      border-radius: 38px;
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 800;
      color: v-bind("[ORDER_STATUS_ENUM.COMPLETED, ORDER_STATUS_ENUM.UNCOMPLETED, ORDER_STATUS_ENUM.SINGLE_BUY].includes(props.orderInfo.status) ? '#FFFFFF' : '#000000'");
      display: flex;
      justify-content: center;
      align-items: center;
      border: v-bind("props.orderInfo.status === ORDER_STATUS_ENUM.INVALID ? '2px solid #D1D1D1' : 'none'");
      position: absolute;
      right: 10px;
    }
  }

  .shareArrow {
    width: 380px;
    height: 240px;
    position: fixed;
    right: 0;
  }
}

.wecomDialog {
  display: flex;
  flex-direction: column;
  align-items: center;

  .dialogText {
    margin: 20px 0px;
  }

  .wecom {
    width: 80%;
    height: 80%;
  }
}
</style>
