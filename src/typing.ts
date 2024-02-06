import type { Ref } from 'vue'

export type MaybeRef<T> = T | Ref<T>

export interface Card {
  isActiveStyle: boolean
  name: string
  endTime: string
  price: number
  partNum: number // 参与拼团人数
  courseNum: number // 常规课次数
  detail: string // 详情说明
  width?: number // 宽
  height?: number // 高
}

export interface Avatar {
  url: string
  name?: string
}

export interface PlayItem {
  imgUrl: string
  title: string
  subTitle?: string
}

export interface OrderInfo {
  card: Card
  avatarList: Avatar[]
  orderStatus: ORDER_STATUS_ENUM
}

export enum ORDER_STATUS_ENUM {
  COMPLETED = 'COMPLETED',
  UNCOMPLETED = 'UNCOMPLETED',
  INVALID = 'INVALID',
}

export const ORDER_STATUS_CN_MAP = {
  [ORDER_STATUS_ENUM.COMPLETED]: '已拼成',
  [ORDER_STATUS_ENUM.UNCOMPLETED]: '未拼成',
  [ORDER_STATUS_ENUM.INVALID]: '已失效',
}

export const ORDER_OP_TEXT = {
  [ORDER_STATUS_ENUM.COMPLETED]: '去使用',
  [ORDER_STATUS_ENUM.UNCOMPLETED]: '邀请好友',
  [ORDER_STATUS_ENUM.INVALID]: '删除订单',
}

export const ORDER_OP_TEXT_COLOR = {
  [ORDER_STATUS_ENUM.COMPLETED]: '#151515',
  [ORDER_STATUS_ENUM.UNCOMPLETED]: '#F54A11',
  [ORDER_STATUS_ENUM.INVALID]: '#1E1E1E',
}

export interface StudentInfoType {
  name: string
  school: string
  birthdate: string
  phone: string
  classTime: string
  howKnow: string
  hasStudiedCoding: boolean
}

export interface BaseResponse {
  code: number
  msg: string
}

export interface GetOpenIdReq {
  code: string
}

export type GetOpenIdRes = BaseResponse & {
  openId: string
}

export type getAuthConfigRes = BaseResponse & {
  timestamp: string
  nonceStr: string
  signature: string
}

export interface PrepayReq {
  openId: string
}

export type PrepayRes = BaseResponse & {
  timestamp: string // 支付签名时间戳
  nonceStr: string // 支付签名随机串
  prepayID: string // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
  paySign: string // 支付签名
}

export interface User {
  phone: string
  token: string
  name: string
}

export interface PhoneLoginReq {
  code: string
  phone: string
}

export type PhoneLoginRes = BaseResponse & {
  data: User
}

export interface GroupSharingInfo {
  deadline: number
  details: string
  endTime: string
  groupBuyingPrice: number
  id: string
  lessonNumber: number
  number: number
  price: number
  rules: string
  shareImgUrl: string
  shareSubTitle: string
  shareTitle: string
  startTime: string
  storeName: string
  vipName: string
}

export type GetGroupSharingDataRes = BaseResponse & {
  data: GroupSharingInfo
}
