// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App'
import 'ChuckCSS/dist/chuckcss'
import 'ChuckCSS/dist/chuckcss.css'
import 'noty/lib/noty.css'
import 'noty/lib/themes/mint.css'
import 'ChuckCSS/dist/print.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import 'animate.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas)

Vue.component('icon', FontAwesomeIcon)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: "<App/>"
})
