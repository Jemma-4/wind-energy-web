import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import * as echarts from 'echarts'
import dataV from '@jiaminghi/data-view'
// import './assets/light.css'
// import './assets/dark.css'

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.use(ElementUI)
Vue.use(dataV)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
