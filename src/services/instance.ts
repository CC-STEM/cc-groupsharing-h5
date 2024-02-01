import axios from 'axios'

export const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL
export const LOGIN_PAHT = '/login'
export const HOME_PATH = '/'

const axiosInstance = axios.create({
  timeout: 20000,
  baseURL: BASE_URL, // TODO: 后续配置为读取环境变量
})

axiosInstance.interceptors.request.use((config) => {
  // const userLoginInfo = getLoginInfo()
  // console.log('userLoginInfo', userLoginInfo)
  // if (userLoginInfo?.token) {
  //   config.headers['Authorization'] = 'Bearer ' + userLoginInfo.token
  // }
  // console.log('new config', config)
  return config
})

axiosInstance.interceptors.response.use((res) => {
  // const code = res.data.code
  // if (code === 401) {
  //   // 鉴权失败，跳登录页
  //   if (!isShowReLoginTip) {
  //     ElMessage({
  //       type: 'warning',
  //       message: '登录态无效，即将跳转至登录页'
  //     })
  //     isShowReLoginTip = true
  //     console.log('import.meta.env.PROD', import.meta.env.PROD)
  //     if (import.meta.env.PROD) {
  //       // setTimeout(() => { window.open(loginUrl, '_top', ''); }, 2000)
  //     }
  //   }
  // }
  return res
})

export default axiosInstance
