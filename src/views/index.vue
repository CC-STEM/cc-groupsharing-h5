<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import wx from 'weixin-js-sdk'

import { useRoute, useRouter } from 'vue-router'
import { closeToast, showLoadingToast, showToast } from 'vant'
import type { GroupOrderInfo, GroupSharingCardInfo, PlayItem, StudentInfoType } from '@/typing'
import GroupSharingCard from '@/components/GroupSharingCard.vue'
import JoinGroupAvatarList from '@/components/Card/JoinGroupAvatarList.vue'
import GroupPlayItem from '@/components/GroupPlayItem.vue'
import CardDescDetail from '@/components/Card/CardDescDetail.vue'
import StudentInfoForm from '@/components/StudentInfoForm.vue'

import play1 from '@/assets/play1.png'
import play2 from '@/assets/play2.png'
import play3 from '@/assets/play3.png'

import DownArrow from '@/assets/downArrow.png'
import RightArrow from '@/assets/rightArrow.png'
import { addGroupBuyingOrder, addStudentInfo, getGroupSharingData, getInitSDKAuthConfig, getSharedGroupData, getWxOpenId, wxPrepay } from '@/services'

// import { useGroupStateStore } from '@/stores'
// import { localStorage } from '@/utils/local-storage'
import { useWXStateStore } from '@/stores'
import { clearLoginInfo, getLoginInfo } from '@/utils/index'

const wxAppID = 'wx65b4e85b0e8a6b93'
const wxStateStore = useWXStateStore()
const router = useRouter()
const route = useRoute()
const shopName = ref('门店名称')
const groupSharingStatus = ref('开团中')
const curGroupOrderInfo = ref<GroupOrderInfo | null>(null)
const showAddStudentInfoDialog = ref(false)

const groupShareUserName = computed(() => {
  const query = route.query
  return query.shareUser || ''
})

const isSharedGroup = computed(() => {
  const query = route.query
  if (query.groupBuyingOrderId)
    return true

  return false
})

const firstTitle = computed(() => {
  // 区分已发起拼团和未发起的情况（管理员初始配置）
  if (isSharedGroup.value)
    return '参与拼团'

  return '发起拼团'
})

const secondTitle = computed(() => {
  if (!isSharedGroup.value)
    return '快呼唤您的小伙伴一起参加吧'

  return groupShareUserName.value ? `${groupShareUserName.value} 邀请您来参与拼团啦！` : ''
})

const cardList = ref<GroupSharingCardInfo[]>([
])
// const { setGroupBuyingCardInfo } = useGroupStateStore()

// const curSharedGroupInfo = ref()

const curSelectedCard = ref<GroupSharingCardInfo | null>(null)
const curBuyStatus = ref<number>(0) // 0 拼团 1 单独买

// const scrollRef = ref(null)
const showCardDetailSheetOption = ref({
  show: false,
})

const shareInfo = computed(() => {
  let shareLink = `${window.location.origin}${window.location.pathname}`
  const loginInfo = getLoginInfo()
  if (loginInfo.name)
    shareLink += `?shareUser=${loginInfo.name}`

  if (route.query.groupBuyingOrderId)
    shareLink += `&groupBuyingOrderId=${route.query.groupBuyingOrderId}`

  console.log('shareLink', shareLink)
  if (curSelectedCard.value) {
    return {
      imgUrl: curSelectedCard.value.shareImgUrl,
      link: shareLink,
      desc: curSelectedCard.value.shareSubTitle, // subTitle
      title: curSelectedCard.value.shareTitle, // title
    }
  }
  return {
    imgUrl: 'https://jkc-1313504415.cos.ap-shanghai.myqcloud.com/wxh5_static%2FsharePic.png',
    link: shareLink,
    desc: '拼团活动期间，用户可在公众号网页发起拼团', // subTitle
    title: '邀好友一起拼', // title
  }
})

const playList = computed<PlayItem[]>(() => {
  if (curSelectedCard.value) {
    return [{
      imgUrl: play1,
      title: '开团/参团',
      subTitle: '拼团享低价',
    }, {
      imgUrl: play2,
      title: '邀请新用户参团',
      subTitle: '分享优惠多',
    }, {
      imgUrl: play3,
      title: `${curSelectedCard.value.number}人成团`,
      subTitle: '',
    }]
  }
  return [{
    imgUrl: play1,
    title: '开团/参团',
    subTitle: '拼团享低价',
  }, {
    imgUrl: play2,
    title: '邀请新用户参团',
    subTitle: '分享优惠多',
  }, {
    imgUrl: play3,
    title: `*人成团`,
    subTitle: '',
  }]
})

function logout() {
  clearLoginInfo()
  router.push('/PhoneLogin')
}

function clickDetail(curCard: GroupSharingCardInfo) {
  console.log('click---')
  showCardDetailSheetOption.value = { show: true }
  curSelectedCard.value = curCard
}

// 支付
async function handlePay(studentInfo: StudentInfoType) {
  // 补充用户信息
  try {
    const res = await addStudentInfo({
      ...studentInfo,
    })
    console.log('addStudentInfo', res)
  }
  catch (e) {
    console.log('addStudentInfo err', e)
  }
  if (wx && curSelectedCard.value) {
    // 先是后端用户下单，下完单之后，前端再调取微信支付
    wxPrepay({ openId: wxStateStore.openId, payAmount: curBuyStatus.value === 0 ? curSelectedCard.value.groupBuyingPrice : curSelectedCard.value.price, payDes: '测试支付' })
      .then(async (res) => {
        console.log('wxPrepay', res)
        const { data: { code, data } } = res
        if (code === 200) {
          console.log(`---统一下单成功，返回结果:${JSON.stringify(data)}\n`)

          // 支付成功后生成拼团业务订单
          // 临时测试
          const loginInfo = getLoginInfo()
          const query = route.query
          const groupBuyingId = curSelectedCard.value.id
          const groupBuyingOrderId = query.groupBuyingOrderId

          console.log('loginInfo', loginInfo)
          console.log('openId', wxStateStore.openId)
          console.log('groupBuyingId', groupBuyingId)
          console.log('groupBuyingOrderId', groupBuyingOrderId)

          wx.chooseWXPay({
            timestamp: Number(data.timeStamp), // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
            package: data.packageVal, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: data.signType, // 微信支付V3的传入RSA,微信支付V2的传入格式与V2统一下单的签名格式保持一致
            paySign: data.paySign, // 支付签名
            success: async (res: any) => {
              console.log(`---chooseWXPay成功，返回结果:${JSON.stringify(res)}\n`)
              const loginInfo = getLoginInfo()
              // 支付成功后生成拼团业务订单
              if (loginInfo && wxStateStore.openId && groupBuyingId) {
                const { data: { data: orderId } } = await addGroupBuyingOrder({
                  openId: wxStateStore.openId,
                  groupBuyingId: Number(groupBuyingId as string),
                  groupBuyingOrderId: groupBuyingOrderId ? Number(groupBuyingOrderId as string) : undefined,
                  mobile: loginInfo.phone,
                  nickName: loginInfo.name,
                  status: curBuyStatus.value,
                })
                console.log('addGroupBuyingOrderId----', orderId)
                console.log('curBuyStatus', curBuyStatus.value)
                // 跳转到主页 TODO: 如果是单买则不带订单id跳转
                if (curBuyStatus.value === 0) {
                  showToast('购买成功，前往我的订单查看')
                  router.push(`/?groupBuyingOrderId=${orderId}`)
                }

                if (curBuyStatus.value === 1) {
                  showToast('购买成功，前往我的订单查看')
                  router.push('/')
                }
                showAddStudentInfoDialog.value = false
              }
            },
            // 支付取消回调函数
            cancel(res: any) {
              console.log(`---chooseWXPay取消，返回结果:${JSON.stringify(res)}\n`)
            },
            // 支付失败回调函数
            fail(res: any) {
              console.log(`---chooseWXPay失败，返回结果:${JSON.stringify(res)}\n`)
            },
          })
        }
        else {
          // 抛出错误
          console.log(`---统一下单失败，返回结果:${JSON.stringify(res)}\n`)
        }
      })
      .catch((err: any) => {
        console.log(`---统一下单失败err，返回结果:${JSON.stringify(err)}\n`)
      })
  }
}

// 0 发起拼团 or 1 单独购买
function handleBuy(buyStatus: number) {
  showAddStudentInfoDialog.value = true
  curBuyStatus.value = buyStatus

  // 跳转拼活动配置id
  // const groupBuyingId = curSelectedCard.value.id
  // if (groupBuyingId) {
  //   router.push(`/StudentInfo?groupBuyingId=${groupBuyingId}&buyStatus=${buyStatus}`)
  // }
  // else {
  //   console.log('当前groupBuyingId', groupBuyingId)
  //   showToast('请稍后重试...')
  // }
}

// 参团
function handleJoinGroup() {
  showAddStudentInfoDialog.value = true
  curBuyStatus.value = 0

  // 跳转拼活动配置id, 订单id
  // const groupBuyingId = curSelectedCard.value.id
  // const groupBuyingOrderId = route.query.groupBuyingOrderId
  // if (groupBuyingId && groupBuyingOrderId) {
  //   router.push(`/StudentInfo?groupBuyingId=${groupBuyingId}&groupBuyingOrderId=${groupBuyingOrderId}&buyStatus=0`)
  // }
  // else {
  //   console.log('当前groupBuyingId, groupBuyingOrderId', groupBuyingId, groupBuyingOrderId)
  //   showToast('请稍后重试...')
  // }
}

function changeCard(cardIndex: number) {
  console.log('changeCard', cardIndex)
  curSelectedCard.value = cardList.value[cardIndex]
}

function inviteOther() {
  showToast('请点击页面右上角 ... 发起分享')
}

watchEffect(async () => {
  const query = route.query
  console.log('routeParams', query)
  if (query.groupBuyingOrderId) {
    const { data: { data } } = await getSharedGroupData(query.groupBuyingOrderId as string)
    console.log('getSharedGroupData', data)
    curGroupOrderInfo.value = data
    cardList.value = [data.groupBuyingInfo].map(item => ({
      ...item,
      width: 618,
    }))
    shopName.value = data.groupBuyingInfo.storeName
    curSelectedCard.value = data.groupBuyingInfo
  }
  else {
    const { data: { data } } = await getGroupSharingData()
    console.log('getGroupSharingData', data)
    cardList.value = data.map(item => ({
      ...item,
      width: 618,
    }))
    if (cardList.value.length) {
      shopName.value = cardList.value[0].storeName
      curSelectedCard.value = cardList.value[0]
    }
  }
})

watch(shareInfo, (newVal) => {
  if (newVal && wx) {
    console.log('newShareInfo', newVal)
    Promise.all([new Promise((resolve) => {
      // 自定义分享
      wx.updateAppMessageShareData({
        ...shareInfo.value,
        success() {
          console.log('设置朋友分享成功')
          resolve(true)
        },
      })
    }), new Promise((resolve) => {
      wx.updateTimelineShareData({
        ...shareInfo.value,
        success() {
          console.log('设置朋友圈分享成功')
          resolve(true)
        },
      })
    })])
  }
})

// 微信相关
// 用户授权，回调，获取openID
function getWxAuth() {
  // 官方参考文档：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
  const code: string = route.query.code as string
  if (!code) {
    // 微信授权，授权后重定向到本页面
    const localUrl = encodeURIComponent(window.location.href)
    console.log('重定向到微信时url', localUrl)
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wxAppID}&redirect_uri=${localUrl}&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect`
  }
  else {
    // 如果已经授权，获取code参数，通过后端获取openID，返回前端，保存本地缓存
    getWxOpenId({ code })
      .then((res) => {
        console.log('getWxOpenId', res)
        const { data: { code, data } } = res
        // openID保存本地
        // wxStateStore.setOpenId('obPGK6JKCgHgBY2xWoadDxZmSGpo')
        if (code === 200) {
          // 测试openId obPGK6JKCgHgBY2xWoadDxZmSGpo
          console.log(`---授权成功，openID:${data}\n`)
          wxStateStore.setOpenId(data)
        }
        else {
          // 抛出错误
          console.log(`---获取openID失败:${JSON.stringify(res)}\n`)
        }
      }).catch((err: any) => {
        console.log(`---获取openID失败err:${JSON.stringify(err)}\n`)
      })
  }
}

// 初始化wx JSSDK
function initWxConfig() {
  showLoadingToast({
    message: '加载中...',
    loadingType: 'spinner',
    duration: 0,
  })
  // 后端获取access_token和ticket，返回签名信息，初始化wx.config
  getInitSDKAuthConfig({
    url: document.URL,
  }).then((res) => {
    console.log('getInitSDKAuthConfig', res)
    const { data: { code, data } } = res
    if (code === 200) {
      console.log(`---获取 ticket成功，返回结果:${JSON.stringify(data)}\n`)

      // 官方参考文档：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#1
      // 初始化验证jssdk
      wx.config({
        debug: false, // 这里一般在测试阶段先用ture，等打包给后台的时候就改回false,
        appId: wxAppID, // 必填，公众号的唯一标识
        timestamp: Number(data.timestamp), // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名
        jsApiList: ['chooseWXPay', 'updateAppMessageShareData', 'updateTimelineShareData'], // 必填，需要使用的JS接口列表
      })

      // 通过ready接口处理成功验证
      wx.ready(async () => {
        console.log(`---初始化wx.config成功\n`)
        wxStateStore.setWx(wx)
        let shareLink = `${window.location.origin}${window.location.pathname}`
        const loginInfo = getLoginInfo()
        if (loginInfo.name)
          shareLink += `?shareUser=${loginInfo.name}`

        if (route.query.groupBuyingOrderId)
          shareLink += `&groupBuyingOrderId=${route.query.groupBuyingOrderId}`

        console.log('shareLink', shareLink)

        wx.checkJsApi({
          jsApiList: ['chooseWXPay', 'updateAppMessageShareData', 'updateTimelineShareData'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
          success: (res: any) => {
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"checkResult":{"chooseWXPay":true},"errMsg":"checkJsApi:ok"}
            console.log(`---检查wx.checkJsApi[chooseWXPay]成功：${JSON.stringify(res)}}\n`)
          },
        })

        Promise.all([new Promise((resolve) => {
          // 自定义分享
          wx.updateAppMessageShareData({
            ...shareInfo.value,
            success() {
              console.log('设置朋友分享成功')
              resolve(true)
            },
          })
        }), new Promise((resolve) => {
          wx.updateTimelineShareData({
            ...shareInfo.value,
            success() {
              console.log('设置朋友圈分享成功')
              resolve(true)
            },
          })
        })]).then(() => {
          closeToast()
        })
      })

      // 通过error接口处理失败验证
      wx.error((err: any) => {
        console.log(`---wx接口失败：${JSON.stringify(err)}}\n`)
      })
    }
    else {
      // 抛出错误
      console.log(`---获取ticket失败，返回结果:${JSON.stringify(res)}\n`)
    }
  }).catch((err: any) => {
    console.log(`---获取ticket失败err，返回结果:${JSON.stringify(err)}\n`)
  })
}

// 微信相关处理逻辑
if (!wxStateStore.openId) {
  // 如果未存，则要通过授权，回调页面，获取code，然后获取openID，保存本地
  getWxAuth()
}

// 初始化wx的jssdk的config
initWxConfig()
</script>

<template>
  <div class="container">
    <div class="header">
      <img class="adImg" src="@/assets/ad.png">
      <div class="sharingBar">
        <div class="left">
          <span>{{ shopName }}</span>
        </div>
        <div class="right">
          <span>{{ groupSharingStatus }}</span>
        </div>
      </div>
      <div class="cardContainertest">
        <van-swipe class="my-swipe" indicator-color="white" @change="changeCard">
          <van-swipe-item v-for="(item, index) in cardList" :key="index">
            <GroupSharingCard
              class="sharingCard" :is-active-style="true" :card-info="item"
              @detail-click="clickDetail(item)"
            />
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
    <div class="content">
      <div class="contentTitle">
        <div class="firstTitle">
          {{ firstTitle }}
        </div>
        <div class="secondTitle">
          {{ secondTitle }}
        </div>
      </div>
      <div class="joinGroup">
        <JoinGroupAvatarList
          v-if="curSelectedCard" :number="curSelectedCard.number"
          :current-number="curGroupOrderInfo?.currentNumber" :is-support-add="true"
        />
        <div v-if="!isSharedGroup" class="createGrougBtnList">
          <div class="singleBuyBtn">
            <div class="price">
              ￥{{ curSelectedCard?.price }}
            </div>
            <div class="desc" @click="handleBuy(1)">
              单独购买
            </div>
          </div>
          <div class="createGroupBtn">
            <div class="price">
              ￥{{ curSelectedCard?.groupBuyingPrice }}
            </div>
            <div class="desc" @click="handleBuy(0)">
              发起拼团
            </div>
          </div>
        </div>
        <div v-if="isSharedGroup && curGroupOrderInfo" class="btnList">
          <template v-if="curSelectedCard && (Date.now() > new Date(curSelectedCard.endTime).getTime())">
            <div class="groupTips">
              该拼团已结束！
            </div>
            <div class="joinGroupBtn" @click="() => { }">
              <div class="desc">
                我知道了
              </div>
            </div>
          </template>
          <template
            v-if="curSelectedCard && (Date.now() <= new Date(curSelectedCard.endTime).getTime()) && curGroupOrderInfo.currentNumber === curSelectedCard.number"
          >
            <div class="groupTips">
              当前团已满员！
            </div>
            <div class="joinGroupBtn" @click="() => { }">
              <div class="desc">
                前往活动主页发起新团
              </div>
            </div>
          </template>
          <template
            v-if="curSelectedCard && (Date.now() <= new Date(curSelectedCard.endTime).getTime()) && curGroupOrderInfo.currentNumber < curSelectedCard.number"
          >
            <div v-if="curGroupOrderInfo.isInOrder" class="groupTips">
              您已成功加入该团！
            </div>
            <div v-if="curGroupOrderInfo.isInOrder" class="joinGroupBtn" @click="inviteOther">
              <div class="desc">
                邀请好友
              </div>
            </div>
            <div v-if="!curGroupOrderInfo.isInOrder" class="joinGroupBtn" @click="handleJoinGroup">
              <div class="desc">
                立即参团
              </div>
              <div class="price">
                ￥{{ curSelectedCard.groupBuyingPrice }}
              </div>
            </div>
          </template>
          <!-- <div class="groupTips">
            该拼团已结束
          </div>
          <div class="joinGroupBtn" @click="handleJoinGroup">
            <div class="desc">
              立即参团
            </div>
            <div class="price">
              ￥{{ curSelectedCard?.groupBuyingPrice }}
            </div>
          </div> -->
        </div>
      </div>
      <div class="joinGroupPlay">
        <div class="top">
          <div class="name">
            拼团玩法 <img class="downArrow" :src="DownArrow" alt="">
          </div>
          <div class="orders" @click="() => { router.push('/Order') }">
            我的拼团订单 <img class="rightArrow" :src="RightArrow" alt="">
          </div>
          <div class="logout" @click="logout">
            退出
          </div>
        </div>
        <div class="playContent">
          <GroupPlayItem
            v-for="(item, index) in playList" :key="index" :img-url="item.imgUrl" :title="item.title"
            :sub-title="item.subTitle"
          />
        </div>
      </div>
      <div class="joinGroupRule">
        <div class="top">
          <div class="name">
            拼团规则 <img class="downArrow" :src="DownArrow" alt="">
          </div>
        </div>
        <div class="ruleContent">
          <img v-if="curSelectedCard" class="ruleImg" :src="curSelectedCard.rules" alt="">
        </div>
      </div>
      <div class="contentFooter">
        本活动最终解释权归XXXX所有
      </div>
    </div>
    <CardDescDetail
      v-if="curSelectedCard" v-model:show-option="showCardDetailSheetOption"
      :cur-selected-card="curSelectedCard"
    />
    <van-dialog
      v-model:show="showAddStudentInfoDialog" :close-on-click-overlay="true" width="100%"
      :show-confirm-button="false" :show-cancel-button="false"
    >
      <StudentInfoForm @handle-click-pay="handlePay" />
    </van-dialog>
  </div>
</template>

<style lang="less" scoped>
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

    .cardContainertest {
      white-space: nowrap;
      width: 100%;
      // overflow-x: scroll;
      height: 336px;
      // display: flex;
      // flex-direction: column;
      // justify-content: center;
      // align-items: center;
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
        .sharingCard {
          margin: 0 15px;
        }
      }
    }

    .shareBtn {
      position: absolute;
      top: 104px;
      right: 0px;
      width: 87px;
      height: 47px;
      background: linear-gradient(90deg, #FFBD4A, #FFAA25, #FF4F0A);
      box-shadow: 0px 1px 25px 2px rgba(0, 0, 0, 0.26);
      border-top-left-radius: 24px;
      border-bottom-left-radius: 24px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #FFFFFF;
      text-align: center;
      line-height: 47px;
    }
  }

  .content {
    height: 70%;
    background-image: url('@/assets/shareBackground.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .contentTitle {
      padding-top: 40px;
      padding-bottom: 27px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .firstTitle {
        font-size: 40px;
        font-family: PingFang SC;
        font-weight: 800;
        color: #FFFFFF;
      }

      .secondTitle {
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 800;
        color: #FFFFFF;
      }
    }

    .joinGroup {
      width: 700px;
      height: 385px;
      background: #FFFFFF;
      border-radius: 30px;
      margin-bottom: 22px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-top: 37px;

      .createGrougBtnList {
        margin-top: 51px;
        height: 88px;
        width: auto;
        display: flex;

        .singleBuyBtn {
          width: 320px;
          height: 88px;
          // background: linear-gradient(90deg, #FABC4F, #FF3A05);
          border: 1px solid #FF3E07;
          // border-image: linear-gradient(0deg, #FF3E07, #FAB84D) 1 1;
          border-radius: 44px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          margin-right: 12px;

          .price {
            // height: 28px;
            font-size: 36px;
            font-family: PingFang SC;
            font-weight: 800;
            color: #FF460C;
            // margin-bottom: 12px;
          }

          .desc {
            // height: 23px;
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #FF460C;
          }
        }

        .createGroupBtn {
          width: 320px;
          height: 88px;
          background: linear-gradient(179deg, #FFE691, #FF3A05);
          border-radius: 44px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;

          .price {
            // height: 28px;
            font-size: 36px;
            font-family: PingFang SC;
            font-weight: 800;
            color: #FFFFFF;
          }

          .desc {
            // height: 23px;
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
          }
        }
      }

      .btnList {
        margin-top: 51px;
        // height: 88px;
        width: auto;
        display: flex;
        flex-direction: column;
        align-items: center;

        .groupTips {
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #000000;
          margin-bottom: 29px;
        }

        .joinGroupBtn {
          display: flex;
          // flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 637px;
          height: 88px;
          background: linear-gradient(179deg, #FFE691, #FF3A05);
          border-radius: 44px;

          .price {
            font-size: 36px;
            font-family: PingFang SC;
            font-weight: 800;
            color: #FFFFFF;
          }

          .desc {
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
          }
        }
      }
    }

    .joinGroupPlay {
      width: 700px;
      height: 330px;
      background: #FFFFFF;
      border-radius: 30px;
      margin-bottom: 24px;
      display: flex;
      // justify-content: center;
      flex-direction: column;
      align-items: center;

      .top {
        margin-top: 39px;
        width: 648px;
        display: flex;
        justify-content: space-between;

        .name {
          height: 31px;
          font-size: 32px;
          font-family: PingFang SC;
          font-weight: 800;
          color: #1A1A1A;
          position: relative;

          .downArrow {
            width: 40px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: -30px;
          }
        }

        .orders {
          // height: 27px;
          // line-height: 27px;
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: 800;
          color: #1A1A1A;
          position: relative;
          margin-right: 26px;

          .rightArrow {
            // width: 20px;
            // height: 20px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
          }
        }

        .logout {
          text-align: center;
          width: 82px;
          height: 39px;
          background: #141414;
          border-radius: 20px;
          font-size: 26px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #FFFFFF;
        }
      }

      .playContent {
        margin-top: 54px;
        width: 648px;
        display: flex;
        justify-content: space-between;
      }
    }

    .joinGroupRule {
      width: 700px;
      height: 669px;
      background: #FFFFFF;
      border-radius: 30px;
      margin-bottom: 24px;
      display: flex;
      // justify-content: center;
      flex-direction: column;
      align-items: center;

      .top {
        margin-top: 39px;
        margin-bottom: 53px;
        width: 648px;
        display: flex;
        justify-content: space-between;

        .name {
          height: 31px;
          font-size: 32px;
          font-family: PingFang SC;
          font-weight: 800;
          color: #1A1A1A;
          position: relative;

          .downArrow {
            width: 40px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: -30px;
          }
        }
      }

      .ruleContent {
        width: 648px;
        overflow-y: scroll;

        // font-size: 24px;
        // font-family: PingFang SC;
        // font-weight: 400;
        // color: #666666;
        .ruleImg {
          width: 100%;
          height: auto
        }
      }
    }

    .contentFooter {
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #E43E12;
    }
  }
}

:deep(.van-swipe-item) {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.van-swipe__indicator) {
  width: 10px;
  height: 10px;
}

:deep(.van-swipe) {
  height: 100%;
}

:deep(.van-dialog) {
  overflow-y: scroll;
  margin-top: 30px;
  height: 90%;
}
</style>
