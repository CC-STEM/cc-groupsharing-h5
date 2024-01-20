import type { GridItem } from 'vant';
<script setup lang="ts">
import { computed } from 'vue'
import type { Avatar } from '@/typing'
import { px2vw } from '@/utils/calcStyle'
import AddImg from '@/assets/add.png'

interface Props {
  avatarList: Avatar[]
  avatarWidth?: number
  avatarHeight?: number
  avatarMargin?: number
  isSupportAdd?: boolean // 是否允许加入拼团动作 （本人加入过则不再允许；首页需要，订单页不需要）
}
const props = defineProps<Props>()
const realAvatarWidth = computed(() => px2vw(props.avatarWidth || 114))
const realAvatarHeight = computed(() => px2vw(props.avatarHeight || 114))
const realAvatarMargin = computed(() => px2vw(props.avatarMargin || 20))
</script>

<template>
  <div class="avatarContainer">
    <div v-for="(item, index) in props.avatarList" :key="index" class="avatarItem">
      <img :src="item.url" alt="">
    </div>
    <div v-if="props.isSupportAdd && props.avatarList.length < 5" class="avatarItem">
      <img :src="AddImg" alt="">
    </div>
  </div>
</template>

<style lang="less" scoped>
.avatarContainer {
  width: 100%;

  .avatarItem {
    width: v-bind(realAvatarWidth);
    height: v-bind(realAvatarHeight);
    background: #FFD201;
    border: 3px solid #FFFFFF;
    border-radius: 50%;
    margin: 0 v-bind(realAvatarMargin);

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
