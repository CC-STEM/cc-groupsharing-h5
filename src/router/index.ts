// https://router.vuejs.org/zh/

import { createRouter, createWebHistory } from 'vue-router/auto'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getLoginInfo } from '@/utils/index'

const LOGIN_PATH = '/PhoneLogin'
const HOME_PATH = '/'

NProgress.configure({ showSpinner: true, parent: '#app' })
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_PUBLIC_PATH),
})

router.beforeEach((_to, _from, next) => {
  NProgress.start() // start progress bar
  const loginInfo = getLoginInfo()
  if (_to.path === LOGIN_PATH || _to.path === HOME_PATH) {
    next()
    return
  }

  if (loginInfo?.token)
    next()
  else
    next('/PhoneLogin')
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

// 导出路由实例，并在 `main.ts` 挂载
export default router
