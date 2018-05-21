import Vue from 'vue'
import Router from './index'

import hello from '@/components/HelloWorld'

import testPage from '@/components/testPage'
import Bar from '@/components/bar'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: hello
    },
    {
      path: '/testPage/:id',
      name: 'testPage',
      component: testPage
    },
    {
      path: '/bar/foo',
      name: 'BarFoo',
      component: Bar
    }
  ]
})

