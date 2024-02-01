import { defineStore } from 'pinia'

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
