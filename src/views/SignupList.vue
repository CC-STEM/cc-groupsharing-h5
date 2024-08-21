<script setup lang="ts">
import { ref } from 'vue'
import type { StudentInfoType } from '@/typing'
import SignupItem from '@/components/Signup/Item.vue'

const studentInfoList = ref<StudentInfoType[]>([{
  childrenName: '黄**',
  school: '育才小学',
  gradeType: 1,
}, {
  childrenName: '黄**',
  school: '育才小学',
  gradeType: 1,
}, {
  childrenName: '黄**',
  school: '育才小学',
  gradeType: 1,
}, {
  childrenName: '黄**',
  school: '育才小学',
  gradeType: 1,
}, {
  childrenName: '黄**',
  school: '育才小学',
  gradeType: 1,
}, {
  childrenName: '黄**',
  school: '育才小学',
  gradeType: 1,
}, {
  childrenName: '黄**',
  school: '育才小学',
  gradeType: 1,
}, {
  childrenName: '黄**',
  school: '育才小学',
  gradeType: 1,
}, {
  childrenName: '黄**',
  school: '育才小学',
  gradeType: 1,
}, {
  childrenName: '黄**',
  school: '育才小学',
  gradeType: 1,
}, {
  childrenName: '黄**',
  school: '育才小学',
  gradeType: 1,
}])
</script>

<template>
  <PageView :has-nav-bar="true" title="报名列表">
    <div class="signupContainer">
      <div class="signupList">
        <SignupItem v-for="(item, index) in studentInfoList" :key="index" :student-info="item" />
      </div>
      <div class="signupBtn">
        立即报名
      </div>
    </div>
  </PageView>
</template>

<style lang="less" scoped>
.signupContainer {
  width: 100vw;

  height: calc(100vh - 88px);
  display: flex;
  flex-direction: column;

  align-items: center;

  .signupList {
    width: 100vw;
    max-height: calc(100vh - 258px);
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    // justify-content: space-around;
    align-items: center;
  }

  .signupBtn {
    width: 670px;
    height: 90px;
    background: #FFD925;
    border-radius: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;

    font-family: PingFang SC;
    font-weight: 800;
    font-size: 30px;
    color: #070200;
  }
}
</style>
