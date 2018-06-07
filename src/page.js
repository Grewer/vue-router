import Vue from 'vue'
import Router from './router/index'

import hello from '@/components/HelloWorld'

import testPage from '@/components/testPage'
import Bar from '@/components/bar'
import Foo from '@/components/foo'
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
    },
    {
      path: '/bar/meta',
      name: 'Bar',
      component: Bar,
      meta:{
        test:'this bar component'
      }
    },
    {
      path:'/foo',
      name:'Foo',
      component:Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    },
    {
      path:'/more/:id/oh/:action',
      name:'Foo',
      component:Foo
    }
  ]
})

