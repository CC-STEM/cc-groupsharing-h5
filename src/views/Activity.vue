<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SignupInfoForm from '@/components/SignupInfoForm.vue'
import PageView from '@/components/PageView.vue'
import ActivityBg from '@/assets/activity.png'
import type { StudentInfoType } from '@/typing'

const realActivityMsg = ref('杨** 刚刚报名参加了活动')
const showSignupInfoDialog = ref(false)
const router = useRouter()

// 点击立即报名
function handleSignUp() {
  // 判断当前是否已报名TODO:
  showSignupInfoDialog.value = true
}

function handleClickRecommendList() {
  router.push('/RecommendList')
}

function handleClickSignupList() {
  router.push('/SignupList')
}

// 支付
async function handlePay(studentInfo: StudentInfoType) {
  console.log('studentInfo', studentInfo)
  // // 补充用户信息
  // try {
  //   const res = await addStudentInfo({
  //     ...studentInfo,
  //   })
  //   console.log('addStudentInfo', res)
  // }
  // catch (e) {
  //   console.log('addStudentInfo err', e)
  // }
  // if (wx && curSelectedCard.value) {
  //   /*
  //       现有流程：
  //       1. 微信支付后台预下单
  //       2. 前端调取微信支付
  //       3. 业务后台生成订单
  //       目前存在并发问题，导致突破成团限制

  //       后续待优化流程：
  //       1. 业务后台生成订单
  //       2. 微信支付后台预下单
  //       3. 前端调取微信支付

  //       所有异常情况（包括取消微信支付）均需要捕获，并调用订单无效接口处理
  //    */
  //   wxPrepay({ openId: wxStateStore.openId, payAmount: curBuyStatus.value === 0 ? curSelectedCard.value.groupBuyingPrice : curSelectedCard.value.price, payDes: curSelectedCard.value.vipName })
  //     .then(async (res) => {
  //       console.log('wxPrepay', res)
  //       const { data: { code, data } } = res
  //       if (code === 200) {
  //         console.log(`---统一下单成功，返回结果:${JSON.stringify(data)}\n`)

  //         // 支付成功后生成拼团业务订单
  //         // 临时测试
  //         const loginInfo = getLoginInfo()
  //         const query = route.query
  //         const groupBuyingId = curSelectedCard.value.id
  //         const groupBuyingOrderId = query.groupBuyingOrderId

  //         console.log('loginInfo', loginInfo)
  //         console.log('openId', wxStateStore.openId)
  //         console.log('groupBuyingId', groupBuyingId)
  //         console.log('groupBuyingOrderId', groupBuyingOrderId)

  //         wx.chooseWXPay({
  //           timestamp: Number(data.timeStamp), // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
  //           nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
  //           package: data.packageVal, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
  //           signType: data.signType, // 微信支付V3的传入RSA,微信支付V2的传入格式与V2统一下单的签名格式保持一致
  //           paySign: data.paySign, // 支付签名
  //           success: async (res: any) => {
  //             console.log(`---chooseWXPay成功，返回结果:${JSON.stringify(res)}\n`)
  //             // 支付成功后生成拼团业务订单
  //             if (loginInfo && wxStateStore.openId && groupBuyingId) {
  //               const { data: { data: orderId } } = await addGroupBuyingOrder({
  //                 openId: wxStateStore.openId,
  //                 groupBuyingId: Number(groupBuyingId as string),
  //                 groupBuyingOrderId: groupBuyingOrderId ? Number(groupBuyingOrderId as string) : undefined,
  //                 mobile: query.shareUser as string,
  //                 nickName: '',
  //                 status: curBuyStatus.value,
  //               })
  //               console.log('addGroupBuyingOrderId----', orderId)
  //               console.log('curBuyStatus', curBuyStatus.value)
  //               // 跳转到主页  如果是单买则不带订单id跳转
  //               if (curBuyStatus.value === 0) {
  //                 showToast('购买成功，前往我的订单查看')
  //                 router.push(`/?groupBuyingOrderId=${orderId}&shareUser=${query.shareUser}`)
  //               }

  //               if (curBuyStatus.value === 1) {
  //                 showToast('购买成功，前往我的订单查看')
  //                 router.push(`/?shareUser=${query.shareUser}`)
  //               }
  //               showAddStudentInfoDialog.value = false
  //             }
  //           },
  //           // 支付取消回调函数
  //           cancel(res: any) {
  //             console.log(`---chooseWXPay取消，返回结果:${JSON.stringify(res)}\n`)
  //           },
  //           // 支付失败回调函数
  //           fail(res: any) {
  //             console.log(`---chooseWXPay失败，返回结果:${JSON.stringify(res)}\n`)
  //           },
  //         })
  //       }
  //       else {
  //         // 抛出错误
  //         console.log(`---统一下单失败，返回结果:${JSON.stringify(res)}\n`)
  //       }
  //     })
  //     .catch((err: any) => {
  //       console.log(`---统一下单失败err，返回结果:${JSON.stringify(err)}\n`)
  //     })
  // }
}
</script>

<template>
  <PageView :has-nav-bar="true" title="活动名称" style="height: 100vh">
    <div class="activityContainer">
      <div class="realmsg">
        {{ realActivityMsg }}
      </div>
      <img :src="ActivityBg" alt="">
    </div>
    <div class="toolbar">
      <div class="rankAndSignList">
        <span @click="handleClickRecommendList">推荐好友排名</span>
        <div class="signupListBtn" @click="handleClickSignupList">
          报名列表
        </div>
      </div>
      <div class="signupBtn">
        <span @click="handleSignUp">立即报名</span>
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
</style>
