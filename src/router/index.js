import Vue from 'vue'

var routersObj = {}
var curView = null


function router(obj) {
  // constructor
  console.log(obj)
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
    location.href = location.href + '#/';
    curView = routersObj['/']
  } else {
    var hash = location.hash.substr(1)
    curView = routersObj[hash]
  }
}

router.prototype.init = function (app) {
  // vue 初始化时
  render();
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
