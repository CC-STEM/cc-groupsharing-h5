import axiosIns from './instance'
import type { AddGroupBuyingOrderReq, AddGroupBuyingOrderRes, AddStudentInfoReq, BaseResponse, DeleteGroupBuyingOrderReq, GetGroupSharingDataRes, GetHistoryOrderListRes, GetOpenIdReq, GetOpenIdRes, GetSharedGroupDataRes, GetStudentInfoRes, PhoneLoginReq, PhoneLoginRes, PrepayReq, PrepayRes, RecommendRankRes, getAuthConfigReq, getAuthConfigRes } from '@/typing'

export function tranformQueryInfoToString<T>(queryInfo: T) {
  const queryInfoWithValueString: Record<string, string> = {}
  const queryInfoWithValueArray: Record<string, Array<T>> = {}
  let arrayValueStr = ''
  for (const key in queryInfo) {
    const item = queryInfo[key as keyof T]
    if (item !== undefined) {
      if (Array.isArray(item))
        queryInfoWithValueArray[key] = item
      else
        queryInfoWithValueString[key] = `${item}`
    }
  }
  console.log('queryInfoWithValueString', queryInfoWithValueString)

  for (const key in queryInfoWithValueArray) {
    const curArr = queryInfoWithValueArray[key]
    arrayValueStr += curArr.map(item => `${key}=${item}`).join('&')
  }
  const urlQueryString = `?${new URLSearchParams(queryInfoWithValueString).toString()}${arrayValueStr ? `&${arrayValueStr}` : ''}`
  return urlQueryString
}

// 微信相关

// 获取openId
export function getWxOpenId(params: GetOpenIdReq) {
  return axiosIns<GetOpenIdRes>({
    method: 'GET',
    url: `/api/user/wechat/userInfo`,
    params,
  })
}

// 获取初始化jssdk 所用签名信息
export function getInitSDKAuthConfig(data: getAuthConfigReq) {
  return axiosIns<getAuthConfigRes>({
    method: 'GET',
    url: `/api/user/wechat/signature`,
    params: data,
  })
}

// 下单
export function wxPrepay(data: PrepayReq) {
  return axiosIns<PrepayRes>({
    method: 'POST',
    url: `/api/user/wechat/prepay`,
    data,
  })
}

// 获取验证码
export function getSMSCode(phone: string) {
  return axiosIns<BaseResponse>({
    method: 'GET',
    url: `/api/msm/send/${phone}`,
  })
}

export function loginByPhone(data: PhoneLoginReq) {
  return axiosIns<PhoneLoginRes>({
    method: 'POST',
    url: `/api/app/h5/login`,
    data,
  })
}

export function getGroupSharingData(mobile: string) {
  return axiosIns<GetGroupSharingDataRes>({
    method: 'GET',
    url: `/api/app/h5/listGroupBuying?mobile=${mobile}`,
  })
}

export function getSharedGroupData(groupBuyingOrderId: string) {
  return axiosIns<GetSharedGroupDataRes>({
    method: 'GET',
    url: `/api/app/h5/myGroupBuyingOrder/${groupBuyingOrderId}`,
  })
}

export function getMyGroupSharingList() {
  return axiosIns<GetHistoryOrderListRes>({
    method: 'GET',
    url: `/api/app/h5/listGroupBuyingOrder`,
  })
}

export function addStudentInfo(data: AddStudentInfoReq) {
  return axiosIns<BaseResponse>({
    method: 'POST',
    url: `/api/app/h5/addMember`,
    data,
  })
}

export function addGroupBuyingOrder(data: AddGroupBuyingOrderReq) {
  return axiosIns<AddGroupBuyingOrderRes>({
    method: 'POST',
    url: `/api/app/h5/addGroupBuyingOrder`,
    data,
  })
}

export function deleteGroupBuyingOrder(data: DeleteGroupBuyingOrderReq) {
  return axiosIns<BaseResponse>({
    method: 'POST',
    url: `/api/app/h5/delGroupBuyingOrder/${data.id}`,
  })
}

export function getMemberInfo() {
  return axiosIns<GetStudentInfoRes>({
    method: 'GET',
    url: `/api/app/h5/getMemberInfo`,
  })
}

export function getUserRecommendRank() {
  return axiosIns<RecommendRankRes>({
    method: 'GET',
    url: `/api/app/h5/rank`,
  })
}
