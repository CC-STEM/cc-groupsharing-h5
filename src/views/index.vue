<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import wx from 'weixin-js-sdk'
import { useRoute, useRouter } from 'vue-router'

import { closeToast, showLoadingToast, showToast } from 'vant'
import type { GroupOrderInfo, GroupSharingCardInfo, StudentInfoType } from '@/typing'

import { addGroupBuyingOrder, addStudentInfo, checkIsInGroup, getGroupSharingData, getInitSDKAuthConfig, getLatestSignupInfo, getSharedGroupData, getWxOpenId, wxPrepay } from '@/services'
import { useWXStateStore } from '@/stores'

import { clearLoginInfo, getLoginInfo } from '@/utils/index'

import SignupInfoForm from '@/components/SignupInfoForm.vue'
import PageView from '@/components/PageView.vue'

const realActivityMsg = ref('杨** 刚刚报名参加了活动')
const showSignupInfoDialog = ref(false)

const wxAppID = 'wx65b4e85b0e8a6b93'
const wxStateStore = useWXStateStore()
const router = useRouter()
const route = useRoute()

const curGroupOrderInfo = ref<GroupOrderInfo | null>(null)
// const curPath = Object.entries(route.query).map(item => `${item[0]}=${item[1]}`).join('&')
const getCurPath = () => Object.entries(route.query).map(item => `${item[0]}=${item[1]}`).join('&')
const isWxReady = ref(false)
const refreshSignupInfoTimer = ref(null)

const curLoginInfo = computed(() => {
  return getLoginInfo()
})

const isSharedGroup = computed(() => {
  const query = route.query
  if (query.groupBuyingOrderId)
    return true

  return false
})

const cardList = ref<GroupSharingCardInfo[]>([
])

const curSelectedCard = ref<GroupSharingCardInfo | null>(null)
const curBuyStatus = ref<number>(0) // 0 拼团 1 单独买

const shareInfo = computed(() => {
  const lastShareUser = route.query.shareUser
  let shareLink = `${window.location.origin}${window.location.pathname}`
  const loginInfo = getLoginInfo()
  // // 当前用户已登录，且当前打开的是一个拼团，用户又已参与过这个团，分享的就是自己的，其他情况都按上一个人的转发
  // if (loginInfo && loginInfo.phone && route.query.groupBuyingOrderId && curGroupOrderInfo.value?.isInOrder)
  //   shareLink += `?shareUser=${loginInfo.phone}`
  // else
  //   shareLink += `?shareUser=${lastShareUser}`

  // 当前分享人设定逻辑，当前用户打开页面，只要已登录，转发人就设定为当前人，否则设定为上一个人
  if (loginInfo && loginInfo.phone)
    shareLink += `?shareUser=${loginInfo.phone}`
  else
    shareLink += `?shareUser=${lastShareUser}`

  if (route.query.groupBuyingOrderId)
    shareLink += `&groupBuyingOrderId=${route.query.groupBuyingOrderId}`

  // 百人团会用
  if (route.query.groupBuyingId)
    shareLink += `&groupBuyingId=${route.query.groupBuyingId}`

  console.log('shareLink', shareLink)
  if (curSelectedCard.value) {
    return {
      imgUrl: curSelectedCard.value.shareImgUrl || 'https://jkc-1313504415.cos.ap-shanghai.myqcloud.com/wxh5_static%2FsharePic.png',
      link: shareLink,
      desc: curSelectedCard.value.shareSubTitle || '报名活动期间，用户可在公众号网页发起报名', // subTitle
      title: curSelectedCard.value.shareTitle || '邀好友参加报名', // title
    }
  }
  return {
    imgUrl: 'https://jkc-1313504415.cos.ap-shanghai.myqcloud.com/wxh5_static%2FsharePic.png',
    link: shareLink,
    desc: '报名活动期间，用户可在公众号网页发起报名', // subTitle
    title: '邀好友参加报名', // title
  }
})

// 报名 == 拼团中的参团
async function handleJoinGroup() {
  const curPath = getCurPath()
  // 检查当前是否有登录态
  const loginInfo = getLoginInfo()
  if (!(loginInfo?.token)) {
    router.push(`/PhoneLogin?${curPath}`)
    return
  }

  // 检查当前是否已参加过活动 : TODO:
  if (curSelectedCard.value) {
    try {
      const { data: { data } } = await checkIsInGroup(curSelectedCard.value.id)
      console.log('checkIsInGroup res', data)
      if (data.hasJoin) {
        showToast('已参与该活动,不可重复参加!')
        return
      }
    }
    catch (e) {
      console.log('checkIsInGroup err', e)
    }
  }

  showSignupInfoDialog.value = true
  curBuyStatus.value = 0
}

function logout() {
  clearLoginInfo()
  router.push('/PhoneLogin')
}

function handleClickSignupList() {
  // e.preventDefault();
  const curPath = getCurPath()
  console.log('******route.query', route.query)
  console.log('******curPath', curPath)
  // alert('***********')
  if (!route.query.groupBuyingId) {
    if (curSelectedCard.value) {
      const groupBuyingId = curSelectedCard.value.id
      router.push(`/SignupList?${curPath ? (`${curPath}&`) : ''}groupBuyingId=${groupBuyingId}`)
      return
    }
  }
  router.push(`/SignupList?${curPath}`)
}

// 跳转推荐量排名列表
function handleClickRecommendList() {
  const curPath = getCurPath()

  console.log('curPath', curPath)
  if (!route.query.groupBuyingId) {
    if (curSelectedCard.value) {
      const groupBuyingId = curSelectedCard.value.id
      router.push(`/RecommendList?${curPath ? (`${curPath}&`) : ''}groupBuyingId=${groupBuyingId}`)
      return
    }
  }
  router.push(`/RecommendList?${curPath}`)
}

// 支付
async function handlePay(studentInfo: StudentInfoType) {
  console.log('studentInfo', studentInfo)
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
    /*
        现有流程：
        1. 微信支付后台预下单
        2. 前端调取微信支付
        3. 业务后台生成订单
        目前存在并发问题，导致突破成团限制

        后续待优化流程：
        1. 业务后台生成订单
        2. 微信支付后台预下单
        3. 前端调取微信支付

        所有异常情况（包括取消微信支付）均需要捕获，并调用订单无效接口处理
     */
    wxPrepay({ openId: wxStateStore.openId, payAmount: curBuyStatus.value === 0 ? curSelectedCard.value.groupBuyingPrice : curSelectedCard.value.price, payDes: curSelectedCard.value.vipName })
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
              // 支付成功后生成拼团业务订单
              if (loginInfo && wxStateStore.openId && groupBuyingId) {
                const { data: { data: orderId } } = await addGroupBuyingOrder({
                  openId: wxStateStore.openId,
                  groupBuyingId: Number(groupBuyingId as string),
                  groupBuyingOrderId: groupBuyingOrderId ? Number(groupBuyingOrderId as string) : undefined,
                  mobile: query.shareUser as string,
                  nickName: '',
                  status: curBuyStatus.value,
                })
                console.log('addGroupBuyingOrderId----', orderId)
                console.log('curBuyStatus', curBuyStatus.value)
                // 跳转到主页  如果是单买则不带订单id跳转
                if (curBuyStatus.value === 0) {
                  showToast('报名成功')
                  router.push(`/?groupBuyingId=${groupBuyingId}&groupBuyingOrderId=${orderId}&shareUser=${query.shareUser}`)
                }

                if (curBuyStatus.value === 1) {
                  showToast('报名成功')
                  router.push(`/?shareUser=${query.shareUser}`)
                }
                showSignupInfoDialog.value = false
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
    curSelectedCard.value = data.groupBuyingInfo
  }
  else {
    const { data: { data } } = await getGroupSharingData(query.shareUser as string, query.groupBuyingId as string)
    console.log('getGroupSharingData', data)
    cardList.value = data.map(item => ({
      ...item,
      width: 618,
    }))
    if (cardList.value.length)
      curSelectedCard.value = cardList.value[0]
  }
})

watch([shareInfo, isWxReady], (newVal) => {
  if (newVal[0] && wx) {
    console.log('newShareInfo', newVal[0])
    console.log('isWxReady', isWxReady.value)
    if (isWxReady.value) {
      Promise.all([new Promise((resolve, reject) => {
        // 自定义分享
        wx.updateAppMessageShareData({
          ...shareInfo.value,
          success() {
            console.log('设置朋友分享成功')
            resolve(true)
          },
          fail(e) {
            console.log('设置异常', e)
            showToast(`微信朋友分享功能设置异常 ${e.errMsg}`)
            reject(e)
          },
        })
      }), new Promise((resolve, reject) => {
        wx.updateTimelineShareData({
          ...shareInfo.value,
          success() {
            console.log('设置朋友圈分享成功')
            resolve(true)
          },
          fail(e) {
            console.log('设置异常', e)
            showToast(`微信朋友圈分享功能设置异常 ${e.errMsg}`)
            reject(e)
          },
        })
      })]).catch((e) => {
        console.log('设置分享异常', e)
      })
    }
  }
}, { immediate: true })

onMounted(() => {
  if (route.query.groupBuyingId) {
    refreshSignupInfoTimer.value = setInterval(async () => {
      const { data: { data } } = await getLatestSignupInfo(route.query.groupBuyingId as string)
      if (data)
        realActivityMsg.value = `${data.childrenName ? (`${data.childrenName.slice(0, 1)}**`) : data.mobile.slice(-4)}刚刚报名参加了活动`
    }, 10000)
  }
})

onUnmounted(() => {
  if (refreshSignupInfoTimer.value)
    clearInterval(refreshSignupInfoTimer.value)
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
        isWxReady.value = true

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
        }).catch((e) => {
          console.log('设置分享异常', e)
        }).finally(() => {
          closeToast()
        })
      })

      // 通过error接口处理失败验证
      wx.error((err: any) => {
        console.log(`---wx接口失败：${JSON.stringify(err)}}\n`)
        closeToast()
      })
    }
    else {
      // 抛出错误
      console.log(`---获取ticket失败，返回结果:${JSON.stringify(res)}\n`)
    }
  }).catch((err: any) => {
    console.log(`---获取ticket失败err，返回结果:${JSON.stringify(err)}\n`)
  }).finally(() => {
    closeToast()
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
  <PageView :has-nav-bar="true" title="活动名称" style="height: 100vh">
    <div v-if="curLoginInfo" class="logout" @click="logout">
      退出
    </div>
    <div class="activityContainer">
      <div class="realmsg">
        {{ realActivityMsg }}
      </div>
      <img v-if="curSelectedCard" :src="curSelectedCard.rules" alt="">
    </div>
    <div class="toolbar">
      <div class="rankAndSignList">
        <span @click="handleClickRecommendList">推荐好友排名</span>
        <div class="signupListBtn" @click="handleClickSignupList">
          报名列表
        </div>
      </div>
      <div class="signupBtn">
        <template v-if="curSelectedCard">
          <template v-if="!isSharedGroup">
            <span @click="handleJoinGroup">立即报名</span>
          </template>
          <template v-else>
            <template v-if="(Date.now() > new Date(curSelectedCard.endTime).getTime())">
              <span>报名已结束</span>
            </template>
            <template v-else-if="curGroupOrderInfo">
              <span v-if="curGroupOrderInfo.isInOrder">已报名</span>
              <span v-else @click="handleJoinGroup">立即报名</span>
            </template>
          </template>
        </template>
      </div>
    </div>
  </PageView>
  <van-dialog
    v-model:show="showSignupInfoDialog" :close-on-click-overlay="true" width="100%"
    style="margin-top:30px;overflow-y: scroll;height: 90%;" :show-confirm-button="false" :show-cancel-button="false"
  >
    <SignupInfoForm @handle-click-pay="handlePay" />
  </van-dialog>
</template>

<style lang="less" scoped>
.activityContainer {
  position: relative;
  width: 100%;
  height: auto;

  .realmsg {
    text-align: center;
    line-height: 50px;
    height: 23px;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 24px;
    color: #FFFFFF;

    position: absolute;
    top: 45px;
    left: 21px;
    width: 325px;
    height: 50px;
    background: #000000;
    border-radius: 25px;
    opacity: 0.74;
  }

  img {
    width: 100vw;
    height: auto;
  }
}

.toolbar {
  border-radius: 20px 20px 0px 0px;
  background-color: white;
  width: 100%;
  height: 160px;
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .rankAndSignList {
    width: 392px;
    height: 82px;
    background: #FF5400;
    border-radius: 41px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      line-height: 25px;
      margin-left: 22px;
      height: 25px;
      font-family: PingFang SC;
      font-weight: 800;
      font-size: 26px;
      color: #FFFFFF;
    }

    .signupListBtn {
      width: 208px;
      height: 100%;
      background: #000000;
      border-radius: 41px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 25px;
      font-family: PingFang SC;
      font-weight: 800;
      font-size: 26px;
      color: #FFFFFF;
    }
  }

  .signupBtn {
    width: 276px;
    height: 82px;
    background: #FFD925;
    border-radius: 41px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    line-height: 29px;
    font-family: PingFang SC;
    font-weight: 800;
    font-size: 30px;
    color: #000000;
  }
}

.logout {
  position: fixed;
  z-index: 999;
  right: 0px;
  // top: 50vh;
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
</style>
