// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import router from './page'

router.beforeEach((to, from, next) => {
  console.log('main.js中注册的全局钩子 运行', to, from)
  next()
  // if (to.toPath === "/bar/meta") {
  //   next()
  // } else {
  //   next("/bar/meta")
  // }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',
  data() {
    return {
      foo: 'test'
    }
  }
})
