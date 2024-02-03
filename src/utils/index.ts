import store from '@/utils/local-storage'
import type { User } from '@/typing'

export function getLoginInfo() {
  const userInfoStr = store.get('userInfo')
  if (userInfoStr) {
    const userInfo: User = JSON.parse(userInfoStr)
    return userInfo
  }
  return null
}

export function setLoginInfo(user: User) {
  if (user)
    store.set('userInfo', JSON.stringify(user))
}

export function clearLoginInfo() {
  localStorage.removeItem('userInfo')
}
