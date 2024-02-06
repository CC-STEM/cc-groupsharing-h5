<script setup lang="ts">
import { useRouter } from 'vue-router'
import PageView from '@/components/PageView.vue'
import { getSMSCode, loginByPhone } from '@/services/index'
import { setLoginInfo } from '@/utils'

const router = useRouter()
const phone = ref('')
const code = ref('')
function onSubmit(values) {
  console.log('submit', values)
}
const getCodeText = ref('获取验证码')
const isGettingCode = ref(false)
const getCodeTimer = ref<NodeJS.Timeout>()
let second = 60

function hanldeSendCode() {
  codeRequest()
  refreshCodeBtn()
}
async function codeRequest() {
  const res = getSMSCode(phone.value)
  console.log('res', res)
}
function refreshCodeBtn() {
  getCodeTimer.value = setTimeout(() => {
    if (second === 0) {
      second = 60
      getCodeText.value = '重新发送'
      isGettingCode.value = false
      clearTimeout(getCodeTimer.value)
      return
    }
    isGettingCode.value = true
    second--
    getCodeText.value = `${second} 秒`
    clearTimeout(getCodeTimer.value)
    refreshCodeBtn()
  }, 1000)
}

async function handleLogin() {
  const { data: { data } } = await loginByPhone({
    code: code.value,
    phone: phone.value,
  })
  setLoginInfo(data)
  // console.log('handleLogin', res)
  router.push('/')
}
</script>

<template>
  <PageView :has-nav-bar="true" title="">
    <div class="loginForm">
      <div class="loginTitle">
        手机号登录
      </div>
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field v-model="phone" name="手机号" placeholder="手机号" :rules="[{ required: false, message: '请填写手机号' }]" />
          <div id="codeFormItem" style="width: 100%;position: relative;">
            <van-field v-model="code" name="验证码" placeholder="验证码" :rules="[{ required: false, message: '请填写验证码' }]" />
            <van-button class="getCode" :disabled="isGettingCode" color=" #ee0a24" round @click="hanldeSendCode">
              {{
                getCodeText
              }}
            </van-button>
          </div>
        </van-cell-group>
        <div>
          <van-button class="loginBtn" round block type="primary" native-type="submit" @click="handleLogin">
            登录
          </van-button>
        </div>
      </van-form>
    </div>
  </PageView>
</template>

<style scoped>
.loginForm {
  background: #FFFFFF;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  .loginTitle {
    margin-top: 98px;
    margin-bottom: 90px;
    font-size: 48px;
    font-family: PingFang SC;
    font-weight: 800;
    color: #000000;
  }

  #codeFormItem {
    width: 100% !important;
    position: relative !important;

    :deep(#van-field-2-input) {
      width: 70%;
    }

    /*
    :deep(.van-button) {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
    } */
  }
}

:deep(.van-form) {
  width: 656px;
}

:deep(.van-cell) {
  height: 100px;
  background: #F4F4F4;
  border-radius: 50px;
  margin: 36px 0;
}

:deep(.van-field__value) {
  font-size: 30px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #B3B3B3;
  display: flex;
  align-items: center;
}

.loginBtn {
  width: 100%;
  height: 100px;
  background: linear-gradient(179deg, #FF9F59, #FF3A05);
  border-radius: 50px;
  font-size: 30px;
  font-family: PingFang SC;
  font-weight: 800;
  color: #FFFFFF;
  padding: 0px;
}

:deep(.van-cell-group) {
  margin: 0px;
}

:deep(.getCode) {
  font-size: 30px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #EC3503;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 30%;
  height: 90px;
}
</style>
