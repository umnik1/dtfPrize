import Vue from 'vue'
import App from './App.vue'
import SmartTable from 'vuejs-smart-table'
import '../src/assets/css/photon.css'
import router from './router' // Ensure this path is correct

Vue.config.productionTip = false

Vue.use(SmartTable)

new Vue({
  router, // Use the router
  render: h => h(App)
}).$mount('#app')