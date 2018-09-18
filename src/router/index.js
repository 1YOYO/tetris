import Vue from 'vue'
import Router from 'vue-router'

import main from '@/pages/main'
import fight from '@/pages/fight'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: { name: 'main' }
    },
    {
      path: '/main',
      name: 'main',
      component: main
    },
    {
      path: '/fight',
      name: 'fight',
      component: fight
    }
  ]
})
