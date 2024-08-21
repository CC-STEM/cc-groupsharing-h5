<script setup lang="ts">
import type { StudentInfoType } from '@/typing'
import { GRADE_TYPE_CN_MAP } from '@/typing'

interface Props {
  studentInfo: StudentInfoType
}
const props = defineProps<Props>()
const getRandomAvatar = () => new URL(`../../assets/avatar/${Math.floor(1 + Math.random() * 17)}.jpg`, import.meta.url).href
const curAvatar = getRandomAvatar()
</script>

<template>
  <div class="signupInfoContainer">
    <div class="userContent">
      <img class="userImg" :src="curAvatar" alt="">
      <div class="userInfo">
        <div class="userName">
          {{ props.studentInfo.childrenName }}
        </div>
        <div class="userSchool">
          {{ props.studentInfo.school }}
        </div>
      </div>
    </div>
    <div class="gradeTag">
      {{ GRADE_TYPE_CN_MAP[props.studentInfo.gradeType] }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.signupInfoContainer {
  background: #FFFFFF;
  border-radius: 20px;
  width: 700px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 11px 0px;
  padding: 20px 0px;

  .userContent {
    display: flex;
    align-items: center;
    margin-left: 26px;

    .userImg {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-right: 22px;
    }

    .userInfo {

      .userName {
        font-family: PingFang SC;
        font-weight: 800;
        font-size: 30px;
        color: #1A1A1A;
      }

      .userSchool {
        font-family: PingFang SC;
        font-weight: 500;
        font-size: 26px;
        color: #858585;
      }
    }
  }

  .gradeTag {
    width: 160px;
    height: 42px;
    background: #F0F0F0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 23px;
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 24px;
    color: #1A1A1A;
  }
}
</style>
