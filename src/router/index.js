import Vue from 'vue'
import Router from 'vue-router'
import Main from '../Main.vue'
import HistoryPage from '../HistoryPage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/history/:id',
      name: 'History',
      component: HistoryPage
    },
    {
      path: '/',
      name: 'Main',
      component: Main
    },

  ]
})