import axios from 'axios'
import { showToast } from 'vant'
import { getLoginInfo } from '@/utils'
import router from '@/router/index'

export const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL
export const LOGIN_PAHT = '/login'
export const HOME_PATH = '/'

// 需校验的登录态接口地址
const AUTH_REQUIRED_APIS = ['/app/h5/getIsInGroup', '/app/h5/rank', '/app/h5/listGroupBuyingOrder', '/app/h5/addMember']

const axiosInstance = axios.create({
  timeout: 20000,
  baseURL: BASE_URL, // TODO: 后续配置为读取环境变量
})

axiosInstance.interceptors.request.use((config) => {
  const userLoginInfo = getLoginInfo()
  console.log('userLoginInfo', userLoginInfo)
  if (userLoginInfo?.token)
    config.headers.Authorization = `Bearer ${userLoginInfo.token}`

  console.log('new config', config)
  return config
})

axiosInstance.interceptors.response.use((res) => {
  console.log('res', res)
  const code = res.data.code
  if (code === 401) {
    // 判断是否访问订单页
    console.log('routeInfo', router.currentRoute.value)
    if (AUTH_REQUIRED_APIS.includes(res.config.url)) {
      // 鉴权失败，跳登录页
      showToast('登录态无效，请重新登录')
      setTimeout(() => {
        const toLoginPath = `/PhoneLogin?${Object.entries(router.currentRoute.value.query).map(item => `${item[0]}=${item[1]}`).join('&')}`
        console.log('toLoginPath111', toLoginPath)
        router.push(toLoginPath)
      }, 1000)
    }
  }
  return res
})

export default axiosInstance
