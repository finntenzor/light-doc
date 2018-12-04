import Vue from 'vue'
import App from './App.vue'
import store from './store'
import './element'
// 暂时关闭PWA
// import './registerServiceWorker'

Vue.config.productionTip = process.env.NODE_ENV !== 'production'

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
