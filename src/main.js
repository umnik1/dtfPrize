import Vue from 'vue'
import App from './App.vue'
import SmartTable from 'vuejs-smart-table'
import '../src/assets/css/photon.css'
Vue.config.productionTip = false

Vue.use(SmartTable)

new Vue({
  render: h => h(App),
}).$mount('#app')
