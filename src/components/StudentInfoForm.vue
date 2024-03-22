<script setup lang="ts">
import { ref, watch } from 'vue'
import { showDialog } from 'vant'
import TipImg from '@/assets/studentInfoTip.png'
import type { StudentInfoType } from '@/typing'

interface Props {
  curInfo?: StudentInfoType
}
const props = defineProps<Props>()
const curEmits = defineEmits(['handleClickPay'])
const myForm = ref(null)
const studentInfo = ref({
  childrenName: '',
  school: '',
  birth: '',
  contact: '',
  classTime: 0,
  isKnowedCc: 0,
  isLearnedCode: 0,
})

watch(() => props.curInfo, (newVal) => {
  if (newVal)
    studentInfo.value = newVal
}, {
  immediate: true,
})

const phonePattern = /^[1][3,4,5,6,7,8,9][0-9]{9}$/

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
  // classTimeResult.value = selectedOptions[0]?.text
  studentInfo.value.classTime = selectedValues[0]
}

watch(() => studentInfo.value.classTime, (newVal) => {
  classTimeResult.value = expectedClassTimeOptions.find(item => item.value === newVal).text
}, {
  immediate: true,
})

function onKnownedCCConfirm({ selectedValues, selectedOptions }) {
  showKnownedCCPicker.value = false
  console.log('selectedValues', selectedValues)
  console.log('selectedOptions', selectedOptions)
  // knownedCCResult.value = selectedOptions[0]?.text
  studentInfo.value.isKnowedCc = selectedValues[0]
}

watch(() => studentInfo.value.isKnowedCc, (newVal) => {
  knownedCCResult.value = HowKnowCCOptions.find(item => item.value === newVal).text
}, {
  immediate: true,
})

function onLearningCodeConfirm({ selectedValues, selectedOptions }) {
  showLearnedCodingPicker.value = false
  console.log('selectedValues', selectedValues)
  console.log('selectedOptions', selectedOptions)
  // learnedCodingResult.value = selectedOptions[0]?.text
  studentInfo.value.isLearnedCode = selectedValues[0]
}

watch(() => studentInfo.value.isLearnedCode, (newVal) => {
  learnedCodingResult.value = hasLearnedCodingOptions.find(item => item.value === newVal).text
}, {
  immediate: true,
})

async function toPay() {
  // 检查当前form
  try {
    await myForm.value.validate()
    curEmits('handleClickPay', studentInfo.value)
  }
  catch (e) {
    console.log('e', e)
    showDialog({
      message: '请填写完成学生信息',
    }).then(() => {
      // on close
    })
  }
}
</script>

<template>
  <div class="formContainer">
    <div class="formHeader">
      <div class="formTitle">
        填写学生信息
      </div>
      <div class="tipBar">
        <span>为了更好地体验课程，请先填写学员信息</span>
        <img class="tipImg" :src="TipImg" alt="">
      </div>
    </div>
    <van-form ref="myForm" :show-error="true" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="studentInfo.childrenName" name="孩子姓名" label="孩子姓名" placeholder="孩子姓名"
          :rules="[{ required: true, message: '' }]"
        />
        <van-field
          v-model="studentInfo.school" name="学校名称" label="学校名称" placeholder="学校名称"
          :rules="[{ required: true, message: '' }]"
        />
        <van-field
          v-model="studentInfo.birth" is-link readonly label="出生日期" placeholder="出生日期"
          :rules="[{ required: true, message: '' }]" @click="showBirthdatePicker = true"
        />
        <van-popup v-model:show="showBirthdatePicker" round position="bottom">
          <!-- <van-picker :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" /> -->
          <van-date-picker
            title="选择日期" :min-date="new Date(1970, 0, 0)" @cancel="showBirthdatePicker = false"
            @confirm="onBirthdateConfirm"
          />
        </van-popup>
        <van-field
          v-model="studentInfo.contact" name="家长联系方式" label="家长联系方式" placeholder="家长联系方式"
          :rules="[{ pattern: phonePattern, message: '格式异常' }]"
        />
        <van-field
          v-model="classTimeResult" is-link readonly label="意向上课时间" placeholder="意向上课时间"
          :rules="[{ required: true, message: '' }]" @click="showClassTimePicker = true"
        />
        <van-popup v-model:show="showClassTimePicker" round position="bottom">
          <van-picker
            :columns="expectedClassTimeOptions" @cancel="showClassTimePicker = false"
            @confirm="onClassTimeConfirm"
          />
          <!-- <van-time-picker type="time" title="选择时间" @cancel="showClassTimePicker = false" @confirm="onClassTimeConfirm" /> -->
        </van-popup>
        <van-field
          v-model="knownedCCResult" is-link readonly label="如何知晓CC编程" placeholder="如何知晓CC编程"
          :rules="[{ required: true, message: '' }]" @click="showKnownedCCPicker = true"
        />
        <van-popup v-model:show="showKnownedCCPicker" round position="bottom">
          <van-picker :columns="HowKnowCCOptions" @cancel="showKnownedCCPicker = false" @confirm="onKnownedCCConfirm" />
        </van-popup>
        <van-field
          v-model="learnedCodingResult" is-link readonly label="是否学过编程" placeholder="是否学过编程"
          :rules="[{ required: true, message: '' }]" @click="showLearnedCodingPicker = true"
        />
        <van-popup v-model:show="showLearnedCodingPicker" round position="bottom">
          <van-picker
            :columns="hasLearnedCodingOptions" @cancel="showLearnedCodingPicker = false"
            @confirm="onLearningCodeConfirm"
          />
        </van-popup>
      </van-cell-group>
      <van-button round block native-type="submit" color="linear-gradient(179deg, #FFE691, #FF3A05)" @click="toPay">
        已填写完成，去支付
      </van-button>
    </van-form>
  </div>
</template>

<style lang="less" scoped>
.formContainer {
  width: 100vw;
  height: auto;
}

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
