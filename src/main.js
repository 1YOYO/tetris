// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

// router
import router from './router'

// Vuex store
import store from './store'

// Element-UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// some global components
import GlobalComponents from './components/index'

// style
import './assets/style/common.less'
import './assets/style/class.less'

// icon
import './assets/font/iconfont.css'

// plugins
import axiosPlugin from './plugins/axiosExtend'

import elementUIPlugin from './plugins/elementUIExtend'

import dialogPlugin from './plugins/dialogExtend'

import canvasPlugin from './plugins/canvasExtend'

import colorPlugin from './plugins/color'

import methodsPlugin from './plugins/methodsExtend'

Vue.use(ElementUI)

Vue.use(GlobalComponents)

Vue.use(axiosPlugin)

Vue.use(elementUIPlugin)

Vue.use(dialogPlugin)

Vue.use(canvasPlugin)

Vue.use(colorPlugin)

Vue.use(methodsPlugin)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
