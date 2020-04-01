import 'babel-polyfill'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue-lazyload'
import 'common/stylus/index.styl'
import 'common/js/filters'
import 'font-awesome/css/font-awesome.min.css'
import './validate'
import Loading from './plugin/loading'
import Toast from './plugin/toast'

import VLoading from './plugin/v-loading/v-loading'
Vue.use(VLoading)
console.log(VLoading)

Vue.use(Loading)
Vue.use(Toast)

Vue.config.productionTip = false

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.jpg')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
