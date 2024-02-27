import type { GridItem } from 'vant';
<script setup lang="ts">
import { computed } from 'vue'
import { px2vw } from '@/utils/calcStyle'
import AddImg from '@/assets/add.png'
import IPAvatar from '@/assets/ip.png'

interface Props {
  // avatarList: Avatar[]
  number: number // 活动配置人数
  currentNumber?: number // 当前参团人数，只有在发起的团里才展示
  avatarWidth?: number
  avatarHeight?: number
  avatarMargin?: number
  // isSupportAdd?: boolean // 是否允许加入拼团动作 （本人加入过则不再允许；首页需要，订单页不需要）
}
const props = defineProps<Props>()
const realAvatarWidth = computed(() => px2vw(props.avatarWidth || 114))
const realAvatarHeight = computed(() => px2vw(props.avatarHeight || 114))
// const realAvatarNameLeft = computed(() => px2vw(props.avatarHeight || 57))
const realAvatarMargin = computed(() => px2vw(props.avatarMargin || 7))
// const CONFIG_AVATAR_LIST = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5]

const avatarList = computed<{ type: string, url: string }[]>(() => {
  const hasAvatarNum = (props.currentNumber > props.number ? props.number : props.currentNumber) || 0
  const addNum = props.number - hasAvatarNum
  const finalList = []
  for (let i = 0; i < hasAvatarNum; i++) {
    finalList.push({
      type: 'AVATAR',
      url: IPAvatar,
    })
  }
  for (let j = 0; j < addNum; j++) {
    finalList.push({
      type: 'ADD',
      url: AddImg,
    })
  }
  return finalList
})
</script>

<template>
  <div class="avatarContainer">
    <div v-for="(item, index) in avatarList" :key="index" class="avatarItem">
      <img :src="item.url" alt="">
      <div v-if="index === 0 && item.type === 'AVATAR'" class="avatarName">
        团长
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.avatarContainer {
  height: v-bind(realAvatarHeight);

  // width: 100%;
  .avatarItem {
    position: relative;
    display: inline-block;
    width: v-bind(realAvatarWidth);
    height: v-bind(realAvatarHeight);
    background: #FFD201;
    border-radius: 50%;
    margin: 0 v-bind(realAvatarMargin);
    border: 3px solid #FFFFFF;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 3px solid #FFFFFF;
    }

    .avatarName {
      display: block;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      // top: 50%;
      // writing-mode: horizontal-tb;
      bottom: -10px;
      width: 78px;
      height: 33px;
      background: #0D0D0D;
      border-radius: 10px;
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      text-align: center;
    }
  }
}
</style>
