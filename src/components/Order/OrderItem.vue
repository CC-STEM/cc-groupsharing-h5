import type { ORDER_STATUS_ENUM } from '@/typing';
<script setup lang="ts">
import { computed } from 'vue'
import type { OrderInfo } from '@/typing'
import { ORDER_OP_TEXT, ORDER_OP_TEXT_COLOR, ORDER_STATUS_CN_MAP, ORDER_STATUS_ENUM } from '@/typing'
import GroupSharingCard from '@/components/GroupSharingCard.vue'
import JoinGroupAvatarList from '@/components/Card/JoinGroupAvatarList.vue'
import { px2vw } from '@/utils/calcStyle'

const props = defineProps<OrderInfo>()
const curEmits = defineEmits(['detailClick'])
const curCard = computed(() => props.card)

const containerWidth = computed(() => px2vw(curCard.value.width || 656))
const orderStatus = computed(() => ORDER_STATUS_CN_MAP[props.orderStatus])
const orderBtnText = computed(() => ORDER_OP_TEXT[props.orderStatus])
const orderTextColor = computed(() => ORDER_OP_TEXT_COLOR[props.orderStatus])
</script>

<template>
  <div class="orderItemContainer">
    <GroupSharingCard
      class="orderSharingCard" :is-active-style="curCard.isActiveStyle" :course-num="curCard.courseNum"
      :end-time="curCard.endTime" :width="curCard.width" :name="curCard.name" :detail="curCard.detail"
      :part-num="curCard.partNum" :price="curCard.price" @detail-click="curEmits('detailClick')"
    />
    <div class="opBox">
      <div class="opAvatar">
        <JoinGroupAvatarList :avatar-list="avatarList" :is-support-add="false" />
        <div class="orderStatus">
          {{ orderStatus }}
        </div>
      </div>
      <div class="opBtn">
        {{ orderBtnText }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.orderItemContainer {
  height: 420px;
  width: v-bind(containerWidth);
  // width: 656px;
  background: #FFFFFF;
  border-radius: 30px;

  .opBox {
    // width: 656px;
    height: 135px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .opAvatar {
      width: auto;
      display: flex;
      align-items: center;

      .orderStatus {
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 800;
        color: v-bind(orderTextColor);
      }
    }

    .opBtn {
      width: 183px;
      height: 76px;
      background: v-bind("props.orderStatus === ORDER_STATUS_ENUM.COMPLETED || props.orderStatus === ORDER_STATUS_ENUM.UNCOMPLETED ? '#000000' : '#FFFFFF'");
      border-radius: 38px;
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 800;
      color: v-bind("props.orderStatus === ORDER_STATUS_ENUM.COMPLETED || props.orderStatus === ORDER_STATUS_ENUM.UNCOMPLETED ? '#FFFFFF' : '#000000'");
      display: flex;
      justify-content: center;
      align-items: center;
      border: v-bind("props.orderStatus === ORDER_STATUS_ENUM.INVALID ? '2px solid #D1D1D1' : 'none'")
    }
  }
}
</style>
