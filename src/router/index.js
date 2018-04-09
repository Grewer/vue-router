import Vue from 'vue'


var curView = {
  template:"<div></div>"
}

var routersObj = {}
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

router.prototype.init = function () {
  // vue 初始化时
}



window.onhashchange = function (urlData) {
  console.log(urlData)
}


router.install = function (Vue, options) {
  Vue.prototype.$route = {test: '1'}

  var hashPosition = location.href.indexOf('#')
  if(hashPosition === -1){
    location.href = location.href+'#/';
    curView = routersObj['/']
    console.log(curView)
    console.log('addhash')
  }else{
    var hash = location.hash.substr(1)
    curView = routersObj[hash]
    console.log('has hash')
  }

  Vue.mixin({
    beforeCreate:function(){
        //检测是否有 router 参数，从而进行初始化的机会
    }
  })

  Vue.component('router-view',curView)
  // 组件渲染  h(component, data, children)
}




export default router
