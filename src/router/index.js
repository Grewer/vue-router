import Vue from 'vue'
import {foreach} from './utils'


class Router {
  constructor(obj) {
    // constructor
    this.current = null
    let resolveArr = [],
      pendingArr = []
    // 假设 钩子
    let {routes = []} = obj;
    foreach(routes, item => {
      let match = patch(item.path).replace(/\//g, '\\/')
      if (item.path.indexOf(':') > -1) {
        // 有属性
        let m = path2Regexp(match)
        item.match = m.match
        item.key = m.key
      } else {
        item.match = match
      }
    })
    this.routes = routes
    console.log(this.routes)
    // 将所有 options 路由,转出一个 match 正则
  }

  init(app) {
    // app 根组件
    // vue 初始化时
    // main app already initialized.
    if (this.app) {
      return
    }
    this.app = app
    this.setupListeners()
    let hash = location.href.indexOf('#') === -1 ? '/' : location.hash.substr(1)
    pushHash(hash)
    this.current = matcher(this.routes, hash).component

    app._router = this.init$router()
    app._router.current = this.init$route(this.current)

  }

  update(route) {
    console.log('update', 'render run')
    this.current = route.route.component
    this.app._route = this.init$route(this.current)
    console.log(this.app)
  }

  init$router() {
    //每个页面都相同
    return {
      push: (location, onComplete, onAbort) => {
        // location 接收一个字符串或对象
        this.transitionTo(location, function (route) {
          pushHash(addQuery(route.toPath, route.query))
          onComplete && onComplete(route);
        }, onAbort)
      },
      replace: (location, onComplete, onAbort) => {
        this.transitionTo(location, function (route) {
          replaceHash(addQuery(route.toPath, route.query))
          onComplete && onComplete(route);
        }, onAbort)
      },
      back() {
        history.back()
      },
      go(n) {
        history.go(n)
      },
      forward() {
        history.forward()
      }
    }

  }

  init$route(current) {
    // console.log('app', app)
    // console.log(this)
    // console.log(app._router.current)
    return {
      fullPath: location.href,
      path: location.path || '/',
      hash: location.hash || '',
      query: {},
      params: {},
      name: '',
      meta: {},
      current
    }
    // let route = {
    //   name: location.name || (record && record.name),
    //   meta: (record && record.meta) || {},
    //   query: query,
    //   params: location.params || {},
    //   fullPath: getFullPath(location, stringifyQuery$$1),
    //   matched: record ? formatMatch(record) : []
    // };
  }

  parse(location) {
    let toPath, route, correct = true
    let query = location.query || {}
    if (location.path) {
      // obj 中的query会覆盖 path中的query
      location = splitQuery(location.path)
      route = matcher(this.routes, location.path)
      toPath = location.path
    } else if (location.name) {
      // name
      // 检验 path 是否需要 数据
      route = matcherByName(this.routes, location.name)
      toPath = route.path
      if (toPath.indexOf(':') > -1) {
        correct = false
      }
    } else {
      location = splitQuery(location)
      route = matcher(this.routes, location.path)
      toPath = location.path
    }
    if (JSON.stringify(query) === '{}') {
      // 若原location中没有 query,则path中的query会覆盖
      query = location.query || {} // 路由path中的query
    }
    return {route, toPath, correct, query}
    // route 传入的参数对象
    // toPath 纯路由 下一步会进入的路由  不包含 ?q=1 等参数
    // correct 路由是否正确 若用 name 进入路由但是路由需要参数 则会将此参数变为false
    // query 路由的 query
  }


  transitionTo(location, onComplete, onAbort) { // vue router 中的函数
    // 步骤
    // 1.根据 location 匹配路径
    // 2.有 onComplete 函数则运行
    // 3.更新 Route
    // 4.若有 read callBack 则运行
    // 5.若当前路由和想去的路由相同 则触发  onAbort 函数
    // location 可能是一个字符串也可能是一个对象 含有 path name param query 等

    let routeObj = this.parse(location); //匹配路径
    console.log(routeObj)
    if (routeObj.correct) {
      // 检验参数是否完整
      // 当 query 变化时 不是同一个path
      if (checkIsRepeat(addQuery(routeObj.toPath, routeObj.query))) {
        //与当前路由重复
        return onAbort && onAbort()
      }
      // 改变路由和组件
      onComplete(routeObj) // todo 加入生成的 route
      this.update(routeObj)

    } else {
      console.error('缺少参数的路径')
    }


    // TODO 添加钩子函数
    // TODO 添加 route 生成,在 conComplete 使用时将route 传递给他 当做参数 她在调用时 pushHash

  }


  setupListeners() {
    window.addEventListener('hashchange', () => {
      console.log('hash change run')
      // 使用 push 变化时不会触发
      // todo
      // this.transitionTo(getHash(), route => {
      //   replaceHash(route.fullPath)
      // })
    })
  }
}


function createRoute() {
  // let route = {
  //   name: location.name || (record && record.name),
  //   meta: (record && record.meta) || {},
  //   path: location.path || '/',
  //   hash: location.hash || '',
  //   query: query,
  //   params: location.params || {},
  //   fullPath: getFullPath(location, stringifyQuery$$1),
  //   matched: record ? formatMatch(record) : []
  // };
}


let View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render(_, ref) {
    // console.log(ref)
    let parent = ref.parent;
    // let data = ref.data;
    let h = parent.$createElement;
    // data.routerView = true;
    let component = parent._routerRoot._route.current
    // console.dir(router)
    // console.log('View render run')
    return h(component)
  }
};


function patch(path) {
  // 补全斜杠
  if (path.charAt(0) !== '/') {
    path = '/' + path
  }
  if (path.charAt(path.length - 1) !== '/') {
    path = path + '/'
  }
  return path
}

function path2Regexp(path) {
  let patt = new RegExp(/\/:.*?\//, "g");
  let result
  let key = []
  // 匹配 :参数
  while ((result = patt.exec(path))) {
    key.push(path.substring(result.index, patt.lastIndex).slice(2, -2))
    let prev = path.substring(0, result.index)
    let next = path.substring(patt.lastIndex)
    path = prev + '\/.*?\/' + next
  }
  return {
    match: path,
    key
  }
}

function matcher(routes, path) {
  path = patch(path)
  return foreach(routes, item => {
    if (path.match(new RegExp(item.match))) {
      if (item.path === '/' && path !== '/') {
        return 0
      }
      return item
    }
  })

  // 待加入未知数的value进routes里
  // 若path是 '/', 则会返回 '/' 路径;
  // 若不是, 当匹配到 '/' 时, 则会继续循环
}

function matcherByName(routes, name) {
  return foreach(routes, item => {
    if (item.name === name) {
      return item
    }
  })
}

function splitQuery(path = '') {
  // 将路由中的 query 分离出来
  let query = {}
  let check = path.indexOf('?')
  if (check > -1) {
    let arr = path.substr(check + 1).split('&')
    arr.forEach(i => {
      let poi = i.indexOf('=');
      query[i.substr(0, poi)] = i.substr(poi + 1)
    })
    path = path.substr(0, check)
  }

  return {
    path,
    query
  }
}

function checkIsRepeat(path) {
  return path === window.location.hash.substring(1)
}

function addQuery(path, query) {
  let q = ''
  for (let i in query) {
    q += '&' + encodeURIComponent(i) + '=' + encodeURIComponent(query[i])
  }
  if (q) {
    return path + '?' + q.substr(1)
  }
  return path
}

function pushHash(hash, params) {
  history.pushState(params || '', '', '#' + hash)
}

function replaceHash(hash, params) {
  history.replaceState(params || '', '', '#' + hash)
}


window.onhashchange = function (urlData) {
  console.log(urlData)
}


Router.install = function (Vue, options) {
  // 插件绑定 还未 new
  // console.dir(this)
  Vue.mixin({
    beforeCreate() {
      // 每次 components 的改变都会催动此函数

      //检测是否有 router 参数，从而进行初始化的机会
      // console.log('before create')
      // console.log(this)

      // this 指向当前组件
      if (this.$options.router) {
        // this->
        // 不一定是根组件 待定
        this._routerRoot = this
        this._router = this.$options.router// new App 接受的router
        this._router.init(this)
        Vue.util.defineReactive(this, '_route', this._router.current);
        //current 为当前对象
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
        // 当前组件

      }
    }
  })
  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._routerRoot._router
    }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route
    }
  })
  Vue.component('router-view', View)
}


export default Router
