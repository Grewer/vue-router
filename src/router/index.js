import Vue from 'vue'


function router() {
  // constructor

}

router.install = function (Vue,options) {
  Vue.prototype.$route = {test:'1'}

}



Vue.use(router)

export default router
