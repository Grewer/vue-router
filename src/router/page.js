import Vue from 'vue'
import Router from './index'

import hello from '@/components/HelloWorld'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: hello
    }
  ]
})
