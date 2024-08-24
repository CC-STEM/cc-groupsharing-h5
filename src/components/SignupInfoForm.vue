<script setup lang="ts">
import { ref, watch } from 'vue'
import { showDialog } from 'vant'
import TipImg from '@/assets/signupInfoTip.png'
import type { StudentInfoType } from '@/typing'
import { GRADE_TYPE_CN_MAP, GRADE_TYPE_ENUM } from '@/typing'

const curEmits = defineEmits(['handleClickPay'])
const myForm = ref(null)
const studentInfo = ref<StudentInfoType>({
  childrenName: '',
  school: '',
  birth: '',
  contact: '',
  gradeType: 1,
})

const phonePattern = /^[1][3,4,5,6,7,8,9][0-9]{9}$/

const showBirthdatePicker = ref(false)
const showGradeTypePicker = ref(false)
const gradeTypeResult = ref('')

const gradeTypeOptions = [{
  text: GRADE_TYPE_CN_MAP[GRADE_TYPE_ENUM.PRESCHOOL],
  value: GRADE_TYPE_ENUM.PRESCHOOL,
}, {
  text: GRADE_TYPE_CN_MAP[GRADE_TYPE_ENUM.PRIMARYLOWGRADE],
  value: GRADE_TYPE_ENUM.PRIMARYLOWGRADE,
}, {
  text: GRADE_TYPE_CN_MAP[GRADE_TYPE_ENUM.PRIMARYHIGHGRADE],
  value: GRADE_TYPE_ENUM.PRIMARYHIGHGRADE,
}, {
  text: GRADE_TYPE_CN_MAP[GRADE_TYPE_ENUM.JUNIORHIGHGRADE],
  value: GRADE_TYPE_ENUM.JUNIORHIGHGRADE,
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

function onGradeTypeConfirm({ selectedValues, selectedOptions }) {
  showGradeTypePicker.value = false
  console.log('selectedValues', selectedValues)
  console.log('selectedOptions', selectedOptions)
  // learnedCodingResult.value = selectedOptions[0]?.text
  studentInfo.value.gradeType = selectedValues[0]
}

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
      teleport: '.pageContainer',
    }).then(() => {
      // on close
    })
  }
}

watch(() => studentInfo.value.gradeType, (newVal) => {
  gradeTypeResult.value = gradeTypeOptions.find(item => item.value === newVal).text
}, {
  immediate: true,
})
</script>

<template>
  <div class="formContainer">
    <div class="formHeader">
      <div class="formTitle">
        立即报名
        <div class="bar" />
      </div>
      <img class="tipImg" :src="TipImg" alt="">
      <!-- <div class="tipBar">
        <span>为了更好地体验课程，请先填写学员信息</span>
      </div> -->
    </div>
    <van-form ref="myForm" :show-error="true" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="studentInfo.childrenName" name="姓名" label="姓名" placeholder="姓名"
          :rules="[{ required: true, message: '' }]"
        />
        <van-field
          v-model="gradeTypeResult" is-link readonly label="组别" placeholder="组别"
          :rules="[{ required: true, message: '' }]" @click="showGradeTypePicker = true"
        />
        <van-popup v-model:show="showGradeTypePicker" round position="bottom">
          <van-picker :columns="gradeTypeOptions" @cancel="showGradeTypePicker = false" @confirm="onGradeTypeConfirm" />
        </van-popup>
        <van-field
          v-model="studentInfo.school" name="学校名称" label="学校名称" placeholder="学校名称"
          :rules="[{ required: true, message: '' }]"
        />
        <van-field
          v-model="studentInfo.contact" name="手机号" label="手机号" placeholder="手机号"
          :rules="[{ pattern: phonePattern, message: '格式异常' }]"
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
      </van-cell-group>
      <van-button round block native-type="submit" @click="toPay">
        已填写完成，去支付
      </van-button>
    </van-form>
  </div>
</template>

<style lang="less" scoped>
.formContainer {
  width: 100%;
  height: auto;
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
  background: #FFD925;
  border-radius: 43px;
}

:deep(.van-form) {
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.van-button__text) {
  font-family: PingFang SC;
  font-weight: 800;
  font-size: 30px;
  color: #1A1A1A;
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
  height: 200px;
  flex-direction: column;
  align-items: center;
  position: relative;

  .tipImg {
    position: absolute;
    right: 0px;
    width: 200px;
    height: 200px;
  }

  .bar {
    width: 195px;
    height: 17px;
    background: #FFD925;
  }
}

.formTitle {
  font-size: 48px;
  font-family: PingFang SC;
  font-weight: 800;
  color: #000000;
  width: 619px;
  margin: 30px 0;
}

// .tipBar {
//   padding-left: 27px;
//   line-height: 50px;
//   width: 619px;
//   height: 50px;
//   background: #FFE8DD;
//   border-radius: 10px;
//   font-size: 24px;
//   font-family: PingFang SC;
//   font-weight: 500;
//   color: #FF5401;
//   position: relative;

//   .tipImg {
//     width: 180px;
//     height: 180px;
//     position: absolute;
//     bottom: -10px;
//   }
// }

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
