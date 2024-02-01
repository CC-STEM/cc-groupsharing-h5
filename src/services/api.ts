import axiosIns from './instance'
import type { GetOpenIdReq, GetOpenIdRes, PrepayReq, PrepayRes, getAuthConfigRes } from '@/typing'

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
    url: `/public/wxPort/getWxOpenId`,
    params,
  })
}

// 获取初始化jssdk 所用签名信息
export function getInitSDKAuthConfig() {
  return axiosIns<getAuthConfigRes>({
    method: 'GET',
    url: `/public/wxPort/getTicket`,
  })
}

// 下单
export function wxPrepay(params: PrepayReq) {
  return axiosIns<PrepayRes>({
    method: 'GET',
    url: `/public/wxPort/prepay`,
    params,
  })
}
