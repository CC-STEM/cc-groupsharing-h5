import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createRouterScroller } from 'vue-router-better-scroller'
import { ActionSheet, FloatingBubble } from 'vant'

// import VConsole from 'vconsole'

import App from './App.vue'
import router from './router'

import 'virtual:uno.css'

import './app.less'

// Vant 桌面端适配
import '@vant/touch-emulator'

/* --------------------------------
Vant 中有个别组件是以函数的形式提供的，
包括 Toast，Dialog，Notify 和 ImagePreview 组件。
在使用函数组件时，unplugin-vue-components
无法自动引入对应的样式，因此需要手动引入样式。
------------------------------------- */
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'
import '@/assets/font/font.css'
import '@/assets/global.less'

const app = createApp(App)
const pinia = createPinia()
// const myVConsole = new VConsole()
// console.log(myVConsole)
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(pinia)
app.use(ActionSheet)
app.use(FloatingBubble)

// 增强了 Vue Router v4 的滚动行为
app.use(createRouterScroller({
  selectors: {
    'window': true,
    'body': true,
    '.scrollable': true,
  },
}))

app.mount('#app')
