<script setup lang="ts">
import { ref } from 'vue'
import PageView from '@/components/PageView.vue'
import TipImg from '@/assets/studentInfoTip.png'
import type { StudentInfoType } from '@/typing'

const studentInfo = ref<StudentInfoType>({
  name: '',
  school: '',
  birthdate: '',
  phone: '',
  classTime: '',
  howKnow: '',
  hasStudiedCoding: false,
})
const showBirthdatePicker = ref(false)
const showClassTimePicker = ref(false)

function onSubmit(values) {
  console.log('submit', values)
}

function onBirthdateConfirm({ selectedValues, selectedOptions }) {
  showBirthdatePicker.value = false
  console.log('selectedValues', selectedValues)
  console.log('selectedOptions', selectedOptions)
  studentInfo.value.birthdate = selectedValues.join('-')
}

function onClassTimeConfirm({ selectedValues, selectedOptions }) {
  showClassTimePicker.value = false
  console.log('selectedValues', selectedValues)
  console.log('selectedOptions', selectedOptions)
  studentInfo.value.classTime = selectedValues.join('-')
}
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
        <van-field v-model="studentInfo.name" name="孩子姓名" label="孩子姓名" placeholder="孩子姓名" />
        <van-field v-model="studentInfo.school" name="学校名称" label="学校名称" placeholder="学校名称" />
        <van-field
          v-model="studentInfo.birthdate" is-link readonly label="出生日期" placeholder="出生日期"
          @click="showBirthdatePicker = true"
        />
        <van-popup v-model:show="showBirthdatePicker" round position="bottom">
          <!-- <van-picker :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" /> -->
          <van-date-picker title="选择日期" @cancel="showBirthdatePicker = false" @confirm="onBirthdateConfirm" />
        </van-popup>
        <van-field v-model="studentInfo.phone" name="家长联系方式" label="家长联系方式" placeholder="家长联系方式" />
        <van-field
          v-model="studentInfo.classTime" is-link readonly label="意向上课时间" placeholder="意向上课时间"
          @click="showClassTimePicker = true"
        />
        <van-popup v-model:show="showClassTimePicker" round position="bottom">
          <!-- <van-picker :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" /> -->
          <van-time-picker type="time" title="选择时间" @cancel="showClassTimePicker = false" @confirm="onClassTimeConfirm" />
        </van-popup>
      </van-cell-group>
      <van-button round block native-type="submit" color="linear-gradient(179deg, #FFE691, #FF3A05)">
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
</style>
