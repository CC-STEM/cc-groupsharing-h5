<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import wx from 'weixin-js-sdk'
import PageView from '@/components/PageView.vue'
import TipImg from '@/assets/studentInfoTip.png'
import type { StudentInfoType } from '@/typing'
import { useWXStateStore } from '@/stores'
import { addStudentInfo, getInitSDKAuthConfig, getWxOpenId, wxPrepay } from '@/services/api'

const route = useRoute()
const studentInfo = ref<StudentInfoType>({
  childrenName: '',
  school: '',
  birth: '',
  contact: '',
  classTime: 0,
  isKnowedCc: 0,
  isLearnedCode: 0,
})

const classTimeResult = ref('')
const knownedCCResult = ref('')
const learnedCodingResult = ref('')
const showBirthdatePicker = ref(false)
const showClassTimePicker = ref(false)
const showKnownedCCPicker = ref(false)
const showLearnedCodingPicker = ref(false)

const expectedClassTimeOptions = [{
  text: '周中白天',
  value: 0,
}, {
  text: '周中晚上',
  value: 1,
}, {
  text: '周六周日白天',
  value: 2,
}, {
  text: '周六周日晚上',
  value: 3,
}]

const HowKnowCCOptions = [{
  text: '朋友介绍',
  value: 0,
}, {
  text: '自己进店咨询',
  value: 1,
}, {
  text: '户外活动',
  value: 2,
}, {
  text: '其他途径',
  value: 3,
}]

const hasLearnedCodingOptions = [{
  text: '是',
  value: 0,
}, {
  text: '否',
  value: 1,
}]

function onSubmit(values) {
  console.log('submit', values)
}

function onBirthdateConfirm({ selectedValues, selectedOptions }) {
  showBirthdatePicker.value = false
  console.log('selectedValues', selectedValues)
  console.log('selectedOptions', selectedOptions)
  studentInfo.value.birth = selectedValues.join('-')
}

function onClassTimeConfirm({ selectedValues, selectedOptions }) {
  showClassTimePicker.value = false
  console.log('selectedValues', selectedValues)
  console.log('selectedOptions', selectedOptions)
  classTimeResult.value = selectedOptions[0]?.text
  studentInfo.value.classTime = selectedValues[0]
}

function onKnownedCCConfirm({ selectedValues, selectedOptions }) {
  showKnownedCCPicker.value = false
  console.log('selectedValues', selectedValues)
  console.log('selectedOptions', selectedOptions)
  knownedCCResult.value = selectedOptions[0]?.text
  studentInfo.value.isKnowedCc = selectedValues[0]
}

function onLearningCodeConfirm({ selectedValues, selectedOptions }) {
  showLearnedCodingPicker.value = false
  console.log('selectedValues', selectedValues)
  console.log('selectedOptions', selectedOptions)
  learnedCodingResult.value = selectedOptions[0]?.text
  studentInfo.value.isLearnedCode = selectedValues[0]
}

// 微信相关
const wxAppID = 'wx65b4e85b0e8a6b93'
const wxStateStore = useWXStateStore()

// 用户授权，回调，获取openID
function getWxAuth() {
  // 官方参考文档：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
  const code: string = route.query.code as string
  if (!code) {
    // 微信授权，授权后重定向到本页面
    const localUrl = window.location.href
    console.log(localUrl)
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wxAppID}&redirect_uri=${localUrl}&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect`
  }
  else {
    // 如果已经授权，获取code参数，通过后端获取openID，返回前端，保存本地缓存
    getWxOpenId({ code })
      .then((res) => {
        console.log('getWxOpenId', res)
        const { data: { code, data } } = res
        // openID保存本地
        wxStateStore.setOpenId('obPGK6JKCgHgBY2xWoadDxZmSGpo')
        if (code === 200) {
          // wxStateStore.setOpenId(res.data.openID)
          // 测试openId obPGK6JKCgHgBY2xWoadDxZmSGpo
          console.log(`---授权成功，openID:${data}\n`)
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
  // 后端获取access_token和ticket，返回签名信息，初始化wx.config
  console.log('location')
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
        debug: true, // 这里一般在测试阶段先用ture，等打包给后台的时候就改回false,
        appId: wxAppID, // 必填，公众号的唯一标识
        timestamp: Number(data.timestamp), // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名
        jsApiList: ['chooseWXPay', 'updateAppMessageShareData', 'updateTimelineShareData'], // 必填，需要使用的JS接口列表
      })

      // 通过ready接口处理成功验证
      wx.ready(() => {
        console.log(`---初始化wx.config成功\n`)
        wx.checkJsApi({
          jsApiList: ['chooseWXPay', 'updateAppMessageShareData', 'updateTimelineShareData'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
          success: (res: any) => {
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"checkResult":{"chooseWXPay":true},"errMsg":"checkJsApi:ok"}
            console.log(`---检查wx.checkJsApi[chooseWXPay]成功：${JSON.stringify(res)}}\n`)
          },
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

// 支付
async function handlePay() {
  // 补充用户信息
  try {
    const res = await addStudentInfo({
      ...studentInfo.value,
    })
    console.log('addStudentInfo', res)
  }
  catch (e) {
    console.log('addStudentInfo err', e)
  }

  // 先是后端用户下单，下完单之后，前端再调取微信支付
  wxPrepay({ openId: wxStateStore.openId, payAmount: 1, payDesc: '测试支付' })
    .then((res: any) => {
      console.log('wxPrepay', res)
      if (res.status.code === 1) {
        console.log(`---统一下单成功，返回结果:${JSON.stringify(res.data)}\n`)
        wx.chooseWXPay({
          timestamp: res.data.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: res.data.nonceStr, // 支付签名随机串，不长于 32 位
          package: `prepay_id=${res.data.prepayID}`, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          signType: 'RSA', // 微信支付V3的传入RSA,微信支付V2的传入格式与V2统一下单的签名格式保持一致
          paySign: res.data.paySign, // 支付签名
          success(res: any) {
            console.log(`---chooseWXPay成功，返回结果:${JSON.stringify(res)}\n`)
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

// 微信相关处理逻辑
if (!wxStateStore.openId) {
  // 如果未存，则要通过授权，回调页面，获取code，然后获取openID，保存本地
  getWxAuth()
}

// 初始化wx的jssdk的config
initWxConfig()
</script>

<template>
  <PageView :has-nav-bar="true">
    <div class="formHeader">
      <div class="formTitle">
        填写学生信息
      </div>
      <div class="tipBar">
        <span>为了更好地体验课程，请先填写学员信息</span>
        <img class="tipImg" :src="TipImg" alt="">
      </div>
    </div>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field v-model="studentInfo.childrenName" name="孩子姓名" label="孩子姓名" placeholder="孩子姓名" />
        <van-field v-model="studentInfo.school" name="学校名称" label="学校名称" placeholder="学校名称" />
        <van-field
          v-model="studentInfo.birth" is-link readonly label="出生日期" placeholder="出生日期"
          @click="showBirthdatePicker = true"
        />
        <van-popup v-model:show="showBirthdatePicker" round position="bottom">
          <!-- <van-picker :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" /> -->
          <van-date-picker
            title="选择日期" :min-date="new Date(1970, 0, 0)" @cancel="showBirthdatePicker = false"
            @confirm="onBirthdateConfirm"
          />
        </van-popup>
        <van-field v-model="studentInfo.contact" name="家长联系方式" label="家长联系方式" placeholder="家长联系方式" />
        <van-field
          v-model="classTimeResult" is-link readonly label="意向上课时间" placeholder="意向上课时间"
          @click="showClassTimePicker = true"
        />
        <van-popup v-model:show="showClassTimePicker" round position="bottom">
          <van-picker
            :columns="expectedClassTimeOptions" @cancel="showClassTimePicker = false"
            @confirm="onClassTimeConfirm"
          />
          <!-- <van-time-picker type="time" title="选择时间" @cancel="showClassTimePicker = false" @confirm="onClassTimeConfirm" /> -->
        </van-popup>
        <van-field v-model="knownedCCResult" is-link readonly label="如何知晓CC编程" @click="showKnownedCCPicker = true" />
        <van-popup v-model:show="showKnownedCCPicker" round position="bottom">
          <van-picker :columns="HowKnowCCOptions" @cancel="showKnownedCCPicker = false" @confirm="onKnownedCCConfirm" />
        </van-popup>
        <van-field
          v-model="learnedCodingResult" is-link readonly label="是否学过编程"
          @click="showLearnedCodingPicker = true"
        />
        <van-popup v-model:show="showLearnedCodingPicker" round position="bottom">
          <van-picker
            :columns="hasLearnedCodingOptions" @cancel="showLearnedCodingPicker = false"
            @confirm="onLearningCodeConfirm"
          />
        </van-popup>
      </van-cell-group>
      <van-button round block native-type="submit" color="linear-gradient(179deg, #FFE691, #FF3A05)" @click="handlePay">
        已填写完成，去支付
      </van-button>
    </van-form>
  </PageView>
</template>

<style lang="less" scoped>
:root {
  --van-picker-action-font-size: 30px;
  --van-picker-title-font-size: 30px;
}

// :deep(.van-form) {
//   width: 619px;
// }

:deep(.van-cell) {
  width: 619px;
  height: 100px;
  background: #FFFFFF;
  border-radius: 20px;
  margin: 20px 0;
}

:deep(.van-cell-group) {
  background: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.van-button) {
  width: 656px;
  height: 87px;
  background: linear-gradient(179deg, #FFE691, #FF3A05);
  border-radius: 43px;
}

:deep(.van-form) {
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.van-button__text) {
  font-size: 30px;
  font-family: PingFang SC;
  font-weight: 800;
  color: #FFFFFF;
}

:deep(.van-field__label) {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #000000;
  display: flex;
  align-items: center;
}

:deep(.van-field__value) {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #B3B3B3;
  display: flex;
  align-items: center;
}

:deep(.van-field__error-message) {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
}

.formHeader {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.formTitle {
  font-size: 48px;
  font-family: PingFang SC;
  font-weight: 800;
  color: #000000;
  width: 619px;
  margin: 30px 0;
}

.tipBar {
  padding-left: 27px;
  line-height: 50px;
  width: 619px;
  height: 50px;
  background: #FFE8DD;
  border-radius: 10px;
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #FF5401;
  position: relative;

  .tipImg {
    width: 180px;
    height: 180px;
    position: absolute;
    bottom: -10px;
  }
}

:deep(.van-picker__toolbar) {
  height: 60px;
}

:deep(.van-picker-column__item) {
  font-size: 30px !important;
}

:deep(.van-picker__cancel) {
  font-size: 30px !important;
}

:deep(.van-picker__title) {
  font-size: 30px !important;
  line-height: 30px !important;
}

:deep(.van-picker__confirm) {
  font-size: 30px !important;
}

:deep(.van-cell__right-icon) {
  font-size: 30px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
