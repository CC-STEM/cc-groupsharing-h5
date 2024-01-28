<script setup lang="ts">
interface Props {
  hasNavBar: boolean
  title?: string
}
const props = defineProps<Props>()
const router = useRouter()

function onClickLeft() {
  router.back()
}
</script>

<template>
  <div class="pageContainer">
    <van-nav-bar v-if="props.hasNavBar" :title="props.title" left-arrow @click-left="onClickLeft" />
    <slot />
  </div>
</template>

<style lang="less" scoped>
.pageContainer {
  width: 100vw;
  height: auto;
}

:deep(.van-nav-bar__content) {
  height: 88px;
}

:deep(.van-nav-bar__title) {
  height: 31px;
  line-height: 31px;
  font-size: 32px;
  font-family: PingFang SC;
  font-weight: 800;
  color: #000000;
}

:deep(.van-nav-bar__arrow) {
  color: #000000;
  font-size: 51px;
}
</style>
