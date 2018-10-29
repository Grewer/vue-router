import {foreach} from './utils'


class Router {
  constructor(obj) {
    // constructor
    this.current = null
    this.beforeHooks = []
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
    let route = this.parse(hash)
    const state = history.state
    pushHash(hash, state)
    if (Object.keys(state || {}).length !== 0) {
      route.params = Object.assign(route.params, state)
    }
    this.update(route)

    app._router = this.init$router()

  }

  update(route) {
    console.log('update')
    this.current = route.route.component
    this.app._route = this.init$route(route)
  }

  init$router() {
    //每个页面都相同
    return {
      push: (location, onComplete, onAbort) => {
        // location 接收一个字符串或对象
        this.transitionTo(location, function (route) {
          pushHash(addQuery(route.toPath, route.query), route.params)
          onComplete && onComplete(route);
        }, onAbort)
      },
      replace: (location, onComplete, onAbort) => {
        this.transitionTo(location, function (route) {
          replaceHash(addQuery(route.toPath, route.query), route.params)
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

  init$route(route) {
    const {query, toPath, params} = route
    route = route.route
    const {name, meta = {}} = route
    return {
      fullPath: addQuery(toPath, query), // path + hash
      path: toPath,
      query,
      params,
      name,
      meta,
      current: route.component
    }
  }

  parse(location) {
    let toPath, route, correct = true
    let {query = {}, params = {}} = location
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
    // name 如果需要 params 会如何
    if (route.params) {
      // path 里的params
      params = Object.assign(params, route.params)
    }
    return {route, toPath, correct, query, params}
    // route 传入的参数对象
    // toPath 纯路由 下一步会进入的路由  不包含 ?q=1 等参数
    // correct 路由是否正确 若用 name 进入路由但是路由需要参数 则会将此参数变为false
    // query 路由的 query
  }

  beforeEach(fn) {
    return registerHook(this.beforeHooks, fn) // 注册方法
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
    this.confirmTransition(routeObj, () => {
      // 检验参数是否完整
      // 当 query 变化时 不是同一个path
      if (checkIsRepeat(addQuery(routeObj.toPath, routeObj.query))) {
        //与当前路由重复
        return onAbort && onAbort()
      }
      // 改变路由和组件

      console.log('run')
      onComplete(routeObj)
      this.update(routeObj)

      // this.readyCbs run

    }, () => {
      onAbort && onAbort()
    })

  }

  confirmTransition(route, onComplete, onAbort) {
    console.log('confirm', this.beforeHooks)

    // if (route.correct) { // 官方再次判断是否为相同
    //   return onAbort && onAbort('相同路由')
    // }

    const queue = [].concat(
      // extractLeaveGuards(deactivated), // 离开的生命周期
      this.beforeHooks,
      // activated.map(function (m) {
      //   return m.beforeEnter;
      // }) // 组件内的进入生命周期
    );

    const abort = function (err) {
      // 暂时如此
      onAbort && onAbort(err);
    };

    const current = this.current // 待修改 获取当前的对象
    const iterator = (hook, next) => { // hook=>钩子函数  next=>回调函数
      hook(route, current, to => {
        if (to === false) {
          abort()
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' && (
            typeof to.path === 'string' ||
            typeof to.name === 'string'
          ))
        ) {
          abort();
          if (typeof to === 'object' && to.replace) {
            this.init$router.replace(to);
          } else {
            this.init$router.push(to);
          }
        } else {
          next(to);
        }
      });
    }

    runQueue(queue, iterator, () => {
      // 此为回调函数
      console.log('runQueue的第三个参数 所有钩子运行完毕时回调',this.beforeHooks)
      onComplete()
    })
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


function registerHook(list, fn) { // 注册hook
  list.push(fn);
  return function () { // 两个注册的钩子是相同一个(===) 则去除重复
    var i = list.indexOf(fn);
    if (i > -1) {
      list.splice(i, 1);
    }
  }
}


function runQueue(queue, fn, cb) { // 运行queue  cb 为所有队列运行完毕的 回调
                                   // 参数 queue 需要运行的队列 fn
  var step = function (index) {
    if (index >= queue.length) { // 此时钩子已经运行完毕, callback 运行
      cb();
    } else { // 此时运行队列中的钩子
      if (queue[index]) { // fn 算是一个包裹的函数 每一次的队列运行都会使用此函数 params {钩子函数,回调函数}
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  }; // step 函数
  step(0);
}

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
    path = prev + '\/(.*)?\/' + next
  }
  return {
    match: path,
    key
  }
}

function matcher(routes, path) {
  path = patch(path)
  return foreach(routes, item => {
    const result = path.match(new RegExp(item.match))
    if (result) {
      if (item.path === '/' && path !== '/') {
        return 0
      }
      if (item.key) {
        let params = {}
        item.key.forEach((k, index) => {
          params[k] = result[1 + index]
        })
        return Object.assign({params}, item)
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
        Vue.util.defineReactive(this, '_route', this._route);
        console.log('run')
        // this._route = this._route
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
