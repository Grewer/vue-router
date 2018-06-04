# vue-router

> a simple hash vue-router

In development

### TODOList

路由 path 暂只支持 'foo/:id'
暂不支持 children // 后续加入

### main api:

- location
- history


### 官方实例 vueRouter 的 API

vueRouter 函数 :
- afterHooks 数组
- app 组件对象 指向app
- apps 组件数组
- beforeHooks 数组
- fallback 布尔值
- history 对于router的操作
- matcher 路由记录操作
- mode 当前模式
- options 传入 vueRouter 的选项
- resolveHooks resolve钩子回调函数的数组

vueRouter.prototype 函数 :
- addRouters 动态添加路由
- afterEach 每一次跳转路由后调用的函数
- back 返回上一个路由
- beforeEach 每一次路由跳转前调用
- forward 前进一个路由
- getMatchedComponents  返回目标位置或是当前路由匹配的组件数组 服务端预加载使用
- go 跳转路由
- init 初始化函数
- match
- onError 路由导航过程中出错时被调用
- onReady 服务端渲染调用
- push 添加路由
  ```js
    this.$router.push(location,function (to) {
            console.log(to) // to 的 route 对象
            // 跳转路由后调用
          },function () {
            //无回调值
            // 当前路径和to路径相同时调用该函数
            console.log('abort')
          })
  ```
- replace 替换当前路由
- resolve 解析目标位置
- currentRoute 当前路由对象


### 需要理解的几个问题

1. 路由加载的主要流程
2. 路由 init 和 history router 函数是否值执行一次,子组件都是复制父组件的值?
3. 路由的匹配 使用正则匹配
4. 嵌套渲染时,不同的 router-view 如何渲染不同的值(或者说是渲染的一个 router-view 组件里仍有 router-view 该如何渲染)


### 参考文档

- [https://segmentfault.com/p/1210000009973331/read](https://segmentfault.com/p/1210000009973331/read)
- [https://router.vuejs.org/zh-cn/](https://router.vuejs.org/zh-cn/)
- [vue-router.js 源码](https://github.com/vuejs/vue-router/blob/dev/dist/vue-router.js)
- [http://cnodejs.org/topic/58d680c903d476b42d34c72b](http://cnodejs.org/topic/58d680c903d476b42d34c72b)

