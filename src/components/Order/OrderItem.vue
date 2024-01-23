<script setup lang="ts">
import { computed } from 'vue'
import type { Card } from '@/typing'
import GroupSharingCard from '@/components/GroupSharingCard.vue'
import JoinGroupAvatarList from '@/components/Card/JoinGroupAvatarList.vue'

interface Props {
  card: Card
  avatarList: Avatar[]
  // orderStatus:
}
const props = defineProps<Props>()
const curEmits = defineEmits(['detailClick'])
const curCard = computed(() => props.card)
</script>

<template>
  <div class="orderItemContainer">
    <GroupSharingCard
      class="orderSharingCard" :is-active-style="curCard.isActiveStyle" :course-num="curCard.courseNum"
      :end-time="curCard.endTime" :width="curCard.width" :name="curCard.name" :detail="curCard.detail"
      :part-num="curCard.partNum" :price="curCard.price" @detail-click="curEmits('detailClick')"
    />
    <div class="opBox">
      <JoinGroupAvatarList />
    </div>
  </div>
</template>

<style lang="less" scoped>
.orderItemContainer {
  height: 420px;
  width: 656px;
}

.opBox {
  width: 656px;
  height: 135px;
}
</style>
