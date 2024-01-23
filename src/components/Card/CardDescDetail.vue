<script setup lang="ts">
import { computed } from 'vue'
import type { Card } from '@/typing'

interface Props {
  showOption: { show: boolean }
  curSelectedCard: Card
}
const props = defineProps<Props>()
const { showOption: cardShowOption } = toRefs(props)
// const isShow = ref<boolean>(props.showCardDetailSheet)
const curCard = computed(() => props.curSelectedCard)
</script>

<template>
  <van-action-sheet v-model:show="cardShowOption.show" title="详情说明" cancel-text="我知道了">
    <!-- <div class="sheetContent">内容</div> -->
    <GroupSharingCard
      :is-active-style="curCard.isActiveStyle" :course-num="curCard.courseNum" :end-time="curCard.endTime"
      :width="curCard.width" :name="curCard.name" :detail="curCard.detail" :part-num="curCard.partNum"
      :price="curCard.price"
    />
    <div class="detailTitle">
      仅限于XX课程，仅限于XX门店使用
    </div>
    <div class="detailDesc">
      文案说明文案说明文案说明文案说明文案说明文案
      文案说明文案说明说明
    </div>
  </van-action-sheet>
</template>

<style lang="less" scoped></style>
