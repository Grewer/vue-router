import Vue from 'vue'

var routersObj = {}
var routerWithParam = []
var curView = null


function router(obj) {
  // constructor
  console.log(obj)
  this.apps = [];
  var resolveArr = [],
    pendingArr = []
  // 假设 钩子

  var routers = obj.routes || [];
  for (var i = 0, l = routers.length; i < l; i++) {
    var cur = routers[i];
    if (cur.path.indexOf(':') !== -1) {
      routerWithParam.push(path2Regexp(cur.path))
    } else {
      routersObj[cur.path] = cur.component
      routersObj[cur.name] = cur.component
    }
  }

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

function path2Regexp(path) {
  var path = path || ''
  var arr = path.split('/')
  var regexp = ''
  var key = []
  if (arr.length > 0) {
    for (var i = 0, l = arr.length; i < l; i++) {
      if (arr[i].charAt(0) === ':') {
        regexp += '/\\.'
        key.push(arr[i].substring(1))
      } else {
        regexp += arr[i]
      }
    }
  }
  return {
    regexp: regexp,
    key: key
  }
}

function matcher(location) {
  let path = location.split('/')
  if (path.length === 0) return; // 后续加入


}

function render() {
  console.log('运行检测', 'render run')
  var hashPosition = location.href.indexOf('#')
  if (hashPosition === -1) {
    pushHash('/')
    curView = routersObj['/']
  } else {
    var hash = location.hash.substr(1)
    curView = routersObj[hash]
  }
  // 后续对动态路径匹配
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
  var str = "/testPage/:id/action/:add/";
  var patt = new RegExp(/\/:\w*\//, "g");
  var result
  // 匹配 :参数
  if (!(result = path.exec(str))) {

  }
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
    component = routersObj[location.name]
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
// var hash = location.hash.substr(1)
// curView = routersObj[hash]


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
