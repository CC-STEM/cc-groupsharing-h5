import type { Ref } from 'vue'

export type MaybeRef<T> = T | Ref<T>

export type Card = {
  isActiveStyle: boolean;
  name: string;
  endTime: string;
  price: number;
  partNum: number; // 参与拼团人数
  courseNum: number; // 常规课次数
  detail: string; // 详情说明
  width?: number; // 宽
  height?: number; // 高
}
