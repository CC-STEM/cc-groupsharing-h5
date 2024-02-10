import { defineStore } from 'pinia'
import type { GroupSharingCardInfo } from '@/typing'

export const useStore = defineStore({
  id: 'index',
  persist: true,
  state: () => ({
    // light || dark
    mode: '',
  }),
})

export const useWXStateStore = defineStore('wxState', {
  state: () => {
    return {
      openId: '',
    }
  },
  actions: {
    setOpenId(openId: string) {
      this.openId = openId
    },
  },
})

export const useGroupStateStore = defineStore('groupStore', {
  state: () => {
    return {
      cardInfo: null,
    }
  },
  actions: {
    setGroupBuyingCardInfo(groupBuyingCardInfo: GroupSharingCardInfo) {
      this.cardInfo = groupBuyingCardInfo
    },
  },
})
