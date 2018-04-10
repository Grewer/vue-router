# vue-router

> vue-router rewrite

In development

### TODOList


1. router and route object


main api:

- hashchange
- location
- history


### 官方实例 vueRouter 的 API

vueRouter 函数:
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

vueRouter.prototype 函数:
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
- replace 替换当前路由
- resolve 解析目标位置
- currentRoute 当前路由对象
