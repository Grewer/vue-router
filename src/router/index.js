import Vue from 'vue'

var routes

function router(obj) {
  // constructor
  console.log(obj)
  this.apps = [];
  this.curView = null
  var resolveArr = [],
    pendingArr = []
  // 假设 钩子

  routes = obj.routes || [];
  for (var i = 0, l = routes.length; i < l; i++) {
    var cur = routes[i];
    var match = patch(cur.path).replace(/\//g, '\\/')
    if (cur.path.indexOf(':') > -1) {
      // 有属性
      var m = path2Regexp(match)
      cur.match = m.match
      cur.key = m.key
    } else {
      cur.match = match
    }
  }
  // 将所有 options 路由,转出一个 match 正则
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
  var patt = new RegExp(/\/:.*?\//, "g");
  var result
  var key = []
  // 匹配 :参数
  while ((result = patt.exec(path))) {
    key.push(path.substring(result.index, patt.lastIndex).slice(2, -2))
    var prev = path.substring(0, result.index)
    var next = path.substring(patt.lastIndex)
    path = prev + '\/.*?\/' + next
  }
  return {
    match: path,
    key: key
  }
}

function matcher(path) {
  var path = patch(path)
  for (var i = 0, l = routes.length; i < l; i++) {
    if (path.match(new RegExp(routes[i].match))) {
      if (routes[i].path === '/' && path !== '/') {
        continue
      }
      return routes[i]
    }
  }
  // 待加入未知数的value进routes里
  // 若path是 '/', 则会返回 '/' 路径;
  // 若不是, 当匹配到 '/' 时, 则会继续循环
}

function matcherByName(name) {
  for (var i = 0, l = routes.length; i < l; i++) {
    if (routes[i].name === name) {
      return routes[i]
    }
  }
}


router.prototype.init = function (app) {
  // vue 初始化时
  var hash = location.href.indexOf('#') === -1 ? '/' : location.hash.substr(1)
  pushHash(hash)
  this.curView = matcher(hash).component

  this.apps.push(app);
  // main app already initialized.
  if (this.app) {
    return
  }
  this.app = app
  //初始化 history api
  //  console.dir(history)
  this.init$router(app)
  this.init$route(app)
}


router.prototype.update = function (route) {
  console.log('运行检测', 'render run')
  this.curView = route.route.component
}

function createRoute() {
  // var route = {
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


router.prototype.init$router = function (app) {
  //每个页面都相同
  var $this = this;
  app.$router = {
    push: function (location, onComplete, onAbort) {
      // location 接收一个字符串或对象
      $this.transitionTo(location, function (route) {
        pushHash(addQuery(route.toPath, route.query))
        onComplete && onComplete(route);
      }, onAbort)
    },
    replace: function (location, onComplete, onAbort) {
      $this.transitionTo(location, function (route) {
        replaceHash(addQuery(route.toPath, route.query))
        onComplete && onComplete(route);
      }, onAbort)
    },
    back: function () {

    },
    go: function () {

    },
    forward: function () {

    }
  }
}

router.prototype.init$route = function (app) {
  //
  return {
    fullPath: location.href,
    path: '',
    query: {},
    params: {},
    name: '',
    meta: {}
  }

}
var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render(_, ref) {
    // console.log(ref)
    var parent = ref.parent;
    var data = ref.data;
    var h = parent.$createElement;
    data.routerView = true;
    var component = ref.parent._router.curView
    // console.dir(router)
    // console.log('View render run')
    return h(component)
  }
};

function splitQuery(path) {
  // 将路由中的 query 分离出来
  var path = path || '', query = {}
  var check = path.indexOf('?')
  if (check > -1) {
    var arr = path.substr(check + 1).split('&')
    arr.forEach(function (i) {
      var poi = i.indexOf('=');
      query[i.substr(0, poi)] = i.substr(poi + 1)
    })
    path = path.substr(0, check)
  }

  return {
    path: path,
    query: query
  }
}

router.prototype.parse = function (location) {
  var toPath, route, correct = true, query = {}
  if (location.path) {
    // obj 中的query会覆盖 path中的query
    query = location.query // obj中的query
    location = splitQuery(location.path)
    if (!query) {
      query = location.query // 路由path中的query
    }
    route = matcher(location.path)
    toPath = location.path
  } else if (location.name) {
    // name
    // 检验 path 是否需要 数据
    route = matcherByName(location.name)
    toPath = route.path
    if (toPath.indexOf(':') > -1) {
      correct = false
    }
  } else {
    location = splitQuery(location)
    query = location.query
    route = matcher(location.path)
    toPath = location.path
  }
  return {route: route, toPath: toPath, correct: correct, query: query}
  // route 传入的参数对象
  // toPath 纯路由 下一步会进入的路由  不包含 ?q=1 等参数
  // correct 路由是否正确 若用 name 进入路由但是路由需要参数 则会将此参数变为false
  // query 路由的 query

}


function checkIsRepeat(path) {
  return path === window.location.hash.substring(1)
}

function addQuery(path, query) {
  let q = ''
  for (var i in query) {
    q += '&' + encodeURIComponent(i) + '=' + encodeURIComponent(query[i])
  }
  if (q) {
    return path + '?' + q.substr(1)
  }
  return path
}

router.prototype.transitionTo = function (location, onComplete, onAbort) { // vue router 中的函数
  var this$1 = this;
  // 步骤
  // 1.根据 location 匹配路径
  // 2.有 onComplete 函数则运行
  // 3.更新 Route
  // 4.若有 read callBack 则运行
  // 5.若当前路由和想去的路由相同 则触发  onAbort 函数
  // location 可能是一个字符串也可能是一个对象 含有 path name param query 等

  var routeObj = this.parse(location); //匹配路径
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
  // this.confirmTransition(route, function () {
  //   this$1.updateRoute(route);
  //   onComplete && onComplete(route);
  //   this$1.ensureURL();
  //
  //   // fire ready cbs once
  //   if (!this$1.ready) {
  //     this$1.ready = true;
  //     this$1.readyCbs.forEach(function (cb) { cb(route); });
  //   }
  // }, function (err) {
  //   if (onAbort) {
  //     onAbort(err);
  //   }
  //   if (err && !this$1.ready) {
  //     this$1.ready = true;
  //     this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
  //   }
  // });

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


router.install = function (Vue, options) {
  // 插件绑定 还未 new

  Vue.mixin({
    beforeCreate: function () {
      //检测是否有 router 参数，从而进行初始化的机会

      if (this.$options.router) {
        this._router = this.$options.router// new App 接受的router
        this._router.init(this)
      } else {
        this._router = this.$parent._router;
        this.$router = this.$parent.$router
        this.$route = this._router.init$route(this)
      }
      Vue.util.defineReactive(this._router, 'curView', this._router.curView);
    }
  })
  Vue.component('router-view', View)
}


export default router
