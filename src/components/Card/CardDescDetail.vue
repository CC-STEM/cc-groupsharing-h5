<script setup lang="ts">
import { computed } from 'vue'
import type { GroupSharingCardInfo } from '@/typing'

interface Props {
  showOption: { show: boolean }
  curSelectedCard: GroupSharingCardInfo
}
const props = defineProps<Props>()
const { showOption: cardShowOption } = toRefs(props)
// const isShow = ref<boolean>(props.showCardDetailSheet)
const curCard = computed(() => props.curSelectedCard)
</script>

<template>
  <van-action-sheet v-model:show="cardShowOption.show" title="详情说明" cancel-text="我知道了">
    <!-- <div class="sheetContent">内容</div> -->
    <GroupSharingCard :card-info="curCard" />
    <div class="detailTitle">
      仅限于通用课程，仅限于{{ curCard.storeName }}门店使用
    </div>
    <div class="detailDesc">
      {{ curCard.details }}
    </div>
  </van-action-sheet>
</template>

<style lang="less" scoped></style>
