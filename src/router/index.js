import Vue from 'vue'

var routes
var curView = null

function router(obj) {
  // constructor
  console.log(obj)
  this.apps = [];
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

function render() {
  console.log('运行检测', 'render run')
  var hash = location.href.indexOf('#') === -1 ? '/' : location.hash.substr(1)
  pushHash(hash)
  curView = matcher(hash).component
}

router.prototype.init = function (app) {
  // vue 初始化时
  render(); // 后续修改


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
        pushHash(route.fullPath)
        onComplete && onComplete(route);
      }, onAbort)
    },
    replace: function () {

    },
    back: function () {

    },
    go: function () {

    },
    forward: function () {

    },
    match: function (location, current) {
      console.log(location, current)
    }
  }
}

router.prototype.init$route = function (app) {
  //
  return {
    fullPath: location.href,
  }

}

router.prototype.parse = function (location) {
  console.log(location)
  // 统一返回一个 path object
  var toPath, route
  // TODO 之前去除?后的query
  if (location.path) {
    // path
    route = matcher(location.path)
    toPath = location.hash
  } else if (location.name) {
    // name
    route = matcherByName(location.name)
    toPath = route.path
  } else {
    route = matcher(location)
    toPath = location
  }
  return {route: route, toPath: toPath}
}

function checkIsRepeat(path) {
  return  path === window.location.hash.substring(1)
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
  // 判断是否相等
  if (checkIsRepeat(routeObj.toPath)) {
    return onAbort && onAbort()
  }

  pushHash(routeObj.toPath)
  curView = routeObj.component
  onComplete && onComplete()
  // TODO 添加钩子函数

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
      // this.$route = {}// 当前页面信息
      // this.$router = {}//页面操作
    }
  })
  Vue.component('router-view', {
    render: function (h) {
      return h(
        curView
      )
    }
  })
}


export default router
