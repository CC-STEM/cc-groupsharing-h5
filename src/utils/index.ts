import store from '@/utils/local-storage'
import type { GroupSharingCardInfo, User } from '@/typing'

export function getLoginInfo(): User | null {
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
  store.clearAll()
}

export function transformDateString(time: string) {
  return new Date(time).toLocaleDateString()
}

// 毫秒转时分秒格式
export function formatTimeBySecond(millseconds: number) {
  const totalSecond = Math.round(millseconds / 1000)
  const hours = Math.floor(totalSecond / 3600)
  const minutes = Math.floor((totalSecond - hours * 3600) / 60)
  const seconds = totalSecond - hours * 3600 - minutes * 60
  // return `${hours ? (hours + '时:') : ''}${minutes ? (minutes + '分:') : ''}${seconds ? (seconds + '秒') : ''}`
  return `${`${hours}小时:`}${`${minutes}分:`}${`${seconds}秒`}`
}

export function calcProgressByCardInfo(curCard: GroupSharingCardInfo) {
  const endTime = curCard.endTime
  const startTime = curCard.startTime
  const totalTime = new Date(endTime).getTime() - new Date(startTime).getTime()
  const passedTime = new Date().getTime() - new Date(startTime).getTime()
  const curPercentValue = Math.floor(passedTime * 100 / totalTime)
  return {
    percent: curPercentValue > 100 ? 100 : curPercentValue,
    remain: formatTimeBySecond(totalTime < passedTime ? 0 : (totalTime - passedTime)),
  }
}

export function generateRandomUserName() {
  const randomNum = `${Math.round(Math.random() * 10000)}`
  if (randomNum.length < 4) {
    const completeZero = Array.from({ length: 4 - randomNum.length }).fill(0).join('')
    return randomNum + completeZero
  }
  return randomNum
}
