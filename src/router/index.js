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


  // 合并routerWithParam 和 routersObj
  // console.log(routerWithParam)
  // 路由匹配机制
  // 直接匹配?
  //
  // 例:
  // /name/:name/action/:action
  // /name/grewer/action/add
  // 匹配思路: 按照 '/' 分成数组,循环匹配,若遇到 带有':'的路由,记录下名称,输出组件
  // 效率太低 no
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
  for (var i = 0, l = routes.length; i < l; i++) {
    if (path.match(new RegExp(routes[i].match))) {
      return routes[i]
    }
  }
}

function render() {
  console.log('运行检测', 'render run')
  var hash = location.href.indexOf('#') === -1 ? '/' : location.hash.substr(1)
  curView = matcher(patch(hash)).component
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

function pathParse(path) {
  // 每次匹配时,检测str最后一位是否是/ 若不是则添加 第一位也许测试

}

router.prototype.match = function (path, cur) {
  console.log(path)
  var path = pathParse(path)

}

router.prototype.init$router = function (app) {
  //每个页面都相同
  var $this = this;
  app.$router = {
    push: function (location, onComplete, onAbort) {
      // TODO push 改变组件方式 先改变路由再显示组件 还是先切换组件再切换路由
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
  var component = ''
  if (location.path) {
    // path
    // 路径匹配 获取组件
  } else if (location.name) {
    // name

  } else {
    // 字符串
    //同1
  }
}


router.prototype.transitionTo = function (location, onComplete, onAbort) { // vue router 中的函数
  var this$1 = this;
  // 步骤
  // 1.根据 location 匹配路径
  // 2.有 onComplete 函数则运行
  // 3.更新 Route
  // 4.若有 read callBack 则运行
  // 5.若当前路由和想去的路由相同 则触发  onAbort 函数
  var route = this.parse(location); //匹配路径
  // location 可能是一个字符串也可能是一个对象 含有 path name param query 等

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
  // window.location.hash = hash
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
