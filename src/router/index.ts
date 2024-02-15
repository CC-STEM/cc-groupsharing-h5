// https://router.vuejs.org/zh/

import { createRouter, createWebHistory } from 'vue-router/auto'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getLoginInfo } from '@/utils/index'

const LOGIN_PATH = '/PhoneLogin'

NProgress.configure({ showSpinner: true, parent: '#app' })
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_PUBLIC_PATH),
})

router.beforeEach((_to, _from, next) => {
  NProgress.start() // start progress bar
  const loginInfo = getLoginInfo()
  if (_to.path === LOGIN_PATH) {
    next()
    return
  }

  const toQuery = _to.query
  console.log('_to', _to)
  console.log('_from', _from)
  if (loginInfo?.token) {
    next()
  }
  else {
    const toLoginPath = `/PhoneLogin?${Object.entries(toQuery).map(item => `${item[0]}=${item[1]}`).join('&')}`
    next(toLoginPath) // 这里要带上原参数
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

// 导出路由实例，并在 `main.ts` 挂载
export default router
