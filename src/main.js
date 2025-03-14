

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "element-plus/theme-chalk/el-message-box.css";
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-loading.css';
import mitt from 'mitt'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

//---------------配置全局事件总线----------------
const bus = mitt()
app.config.globalProperties.$bus = bus 
//----------------------------------------------
app.mount('#app')


