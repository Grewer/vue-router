import Vue from 'vue'

var routersObj = {}
var curView = null


function router(obj) {
  // constructor
  console.log(obj)
  this.apps = [];

  var routers = obj.routes || [];
  for (var i = 0, l = routers.length; i < l; i++) {
    var cur = routers[i];
    routersObj[cur.path] = cur.component
    routersObj[cur.name] = cur.component
  }
}

function render(){
  console.log('运行检测','render run')
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
   console.dir(history)
  this.init$router(app)
  this.init$route(app)
}

router.prototype.init$router = function (app) {
  //每个页面都相同
  var $this = this;
  app.$router = {
    push:function (location, onComplete, onAbort) {
        // location 接收一个字符串或对象
      $this.transitionTo(location,function (route) {
        pushHash(route.fullPath)
        handleScroll(this$1.router, route, fromRoute, false);
        onComplete && onComplete(route);
      }, onAbort)
    },
    replace:function () {

    },
    back:function () {

    },
    go:function () {

    },
    forward:function () {

    }
  }
}

router.prototype.init$route = function (app) {
  //
  return {
    fullPath:location.href,
  }

}

router.prototype.transitionTo = function (location,onComplete,onAbort) { // vue router 中的函数
  var this$1 = this;

  // var route = this.router.match(location, this.current); //匹配路径


  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });

}



function pushHash(hash,params) {
  history.pushState(params||'','','#'+hash)
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
      }else{
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
