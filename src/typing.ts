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

// export interface OrderInfo {
//   card: GroupSharingCardInfo
//   avatarList: Avatar[]
//   orderStatus: ORDER_STATUS_ENUM
// }

export enum ORDER_STATUS_ENUM {
  UNCOMPLETED = 0,
  COMPLETED = 1,
  INVALID = 2,
  SINGLE_BUY = 3, // 单买
}

export const ORDER_STATUS_CN_MAP = {
  [ORDER_STATUS_ENUM.COMPLETED]: '已拼成',
  [ORDER_STATUS_ENUM.UNCOMPLETED]: '未拼成',
  [ORDER_STATUS_ENUM.INVALID]: '已失效',
  [ORDER_STATUS_ENUM.SINGLE_BUY]: '已单买',
}

export const ORDER_OP_TEXT = {
  [ORDER_STATUS_ENUM.COMPLETED]: '去使用',
  [ORDER_STATUS_ENUM.UNCOMPLETED]: '邀请好友',
  [ORDER_STATUS_ENUM.INVALID]: '删除订单',
  [ORDER_STATUS_ENUM.SINGLE_BUY]: '去使用',
}

export const ORDER_OP_TEXT_COLOR = {
  [ORDER_STATUS_ENUM.COMPLETED]: '#151515',
  [ORDER_STATUS_ENUM.UNCOMPLETED]: '#F54A11',
  [ORDER_STATUS_ENUM.INVALID]: '#1E1E1E',
  [ORDER_STATUS_ENUM.SINGLE_BUY]: '#151515',
}

export interface StudentInfoType {
  childrenName?: string
  school?: string
  birth?: string
  contact?: string
  classTime?: number
  isLearnedCode?: number
  isKnowedCc?: number
  gradeType?: number
}

export interface BaseResponse {
  code: number
  msg: string
}

export interface GetOpenIdReq {
  code: string
}

export type GetOpenIdRes = BaseResponse & {
  data: string
}

export interface getAuthConfigReq {
  url?: string
}

export type getAuthConfigRes = BaseResponse & {
  data: {
    timestamp: string
    nonceStr: string
    signature: string
  }
}

export interface PrepayReq {
  openId: string
  payAmount: number
  payDes?: string
}

export interface AddStudentInfoReq {
  birth?: string
  childrenName?: string
  classTime?: number
  contact?: string
  isKnowedCc?: number
  isLearnedCode?: number
  school?: string
  gradeType?: number
}

export type PrepayRes = BaseResponse & {
  data: {
    timeStamp: string // 支付签名时间戳
    nonceStr: string // 支付签名随机串
    // prepayID: string // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
    paySign: string // 支付签名
    signType: string // 签名算法
    packageVal: string // prepay_id=***
    appId: string
  }
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

export interface GroupSharingCardInfo {
  width?: number
  height?: number
  deadline?: number
  details: string
  endTime: number
  groupBuyingPrice?: number
  id?: string
  lessonNumber: number
  number: number
  price: number
  rules?: string
  shareImgUrl?: string
  shareSubTitle?: string
  shareTitle?: string
  startTime?: number
  storeName?: string
  vipName: string
  wecom?: string
  groupBuyingType?: number
  title?: string
}

export type GetGroupSharingDataRes = BaseResponse & {
  data: GroupSharingCardInfo[]
}

export interface AddGroupBuyingOrderReq {
  groupBuyingId: number // 拼团活动id 后台配置
  groupBuyingOrderId?: number // 拼团订单id
  mobile: string
  nickName: string
  openId: string
  status: number
}

export type AddGroupBuyingOrderRes = BaseResponse & {
  data: string // 订单id
}

export interface GroupOrderInfo {
  groupBuyingInfo: GroupSharingCardInfo
  currentNumber: number // 当前参团人数
  isHead: number // 当前用户是否团长
  isInOrder: number // 当前用户是否已参团
  orderId: string
}

export type GetSharedGroupDataRes = BaseResponse & {
  data: GroupOrderInfo
}

export interface MyHistoryOrderInfo {
  groupBuyingInfo: GroupSharingCardInfo
  currentNumber: number // 当前参团人数
  isHead: number // 当前用户是否团长
  id: string
  status: number // 订单状态
}

export type GetHistoryOrderListRes = BaseResponse & {
  data: MyHistoryOrderInfo[]
}

export interface DeleteGroupBuyingOrderReq {
  id: string
}

export type GetStudentInfoRes = BaseResponse & {
  data: StudentInfoType
}

export interface RecommendRankItem {
  no: number
  nickName: string
  mobile: string
  count: number
  differ: number
  currentUser: boolean
}

export type RecommendRankRes = BaseResponse & {
  data: RecommendRankItem[]
}

export type GetHasJoinGroupRes = BaseResponse & {
  data: {
    hasJoin: boolean
  }
}

export interface GetSignupListRes extends BaseResponse {
  data: StudentInfoType[]
}

export enum GRADE_TYPE_ENUM {
  PRESCHOOL = 1,
  PRIMARYLOWGRADE = 2,
  PRIMARYHIGHGRADE = 3,
  JUNIORHIGHGRADE = 4, //
}

export const GRADE_TYPE_CN_MAP = {
  [GRADE_TYPE_ENUM.PRESCHOOL]: '学前幼儿组',
  [GRADE_TYPE_ENUM.PRIMARYLOWGRADE]: '小学低年级组',
  [GRADE_TYPE_ENUM.PRIMARYHIGHGRADE]: '小学高年级组',
  [GRADE_TYPE_ENUM.JUNIORHIGHGRADE]: '初中组',
}
