import _JSON$stringify from 'babel-runtime/core-js/json/stringify';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import Vue from 'vue';
import { foreach } from './utils';

var routes = void 0;

var Router = function () {
  function Router(obj) {
    _classCallCheck(this, Router);

    // constructor
    console.log(obj);
    this.apps = [];
    this.curView = null;
    var resolveArr = [],
        pendingArr = [];
    // 假设 钩子
    var _obj$routes = obj.routes,
        routes = _obj$routes === undefined ? [] : _obj$routes;

    foreach(routes, function (item) {
      var match = patch(item.path).replace(/\//g, '\\/');
      if (item.path.indexOf(':') > -1) {
        // 有属性
        var m = path2Regexp(match);
        item.match = m.match;
        item.key = m.key;
      } else {
        item.match = match;
      }
    });
    this.routes = routes;
    console.log(this.routes);
    // 将所有 options 路由,转出一个 match 正则
  }

  _createClass(Router, [{
    key: 'init',
    value: function init(app) {
      // vue 初始化时
      var hash = location.href.indexOf('#') === -1 ? '/' : location.hash.substr(1);
      pushHash(hash);
      this.curView = matcher(this.routes, hash).component;

      this.apps.push(app);
      // main app already initialized.
      if (this.app) {
        return;
      }
      this.app = app;
      //初始化 history api
      //  console.dir(history)
      this.init$router(app);
      Router.init$route(app);
    }
  }, {
    key: 'update',
    value: function update(route) {
      console.log('运行检测', 'render run');
      this.curView = route.route.component;
    }
  }, {
    key: 'init$router',
    value: function init$router(app) {
      //每个页面都相同
      app.$router = {
        push: function push(location, onComplete, onAbort) {
          // location 接收一个字符串或对象
          this.transitionTo(location, function (route) {
            pushHash(addQuery(route.toPath, route.query));
            onComplete && onComplete(route);
          }, onAbort);
        },
        replace: function replace(location, onComplete, onAbort) {
          this.transitionTo(location, function (route) {
            replaceHash(addQuery(route.toPath, route.query));
            onComplete && onComplete(route);
          }, onAbort);
        },
        back: function back() {},
        go: function go() {},
        forward: function forward() {}
      };
    }
  }, {
    key: 'init$route',
    value: function init$route(app) {
      return {
        fullPath: location.href,
        path: '',
        query: {},
        params: {},
        name: '',
        meta: {}
      };
    }
  }, {
    key: 'parse',
    value: function parse(location) {
      var toPath = void 0,
          route = void 0,
          correct = true;
      var query = location.query || {};
      if (location.path) {
        // obj 中的query会覆盖 path中的query
        location = splitQuery(location.path);
        route = matcher(this.routes, location.path);
        toPath = location.path;
      } else if (location.name) {
        // name
        // 检验 path 是否需要 数据
        route = matcherByName(this.routes, location.name);
        toPath = route.path;
        if (toPath.indexOf(':') > -1) {
          correct = false;
        }
      } else {
        location = splitQuery(location);
        route = matcher(this.routes, location.path);
        toPath = location.path;
      }
      if (_JSON$stringify(query) === '{}') {
        // 若原location中没有 query,则path中的query会覆盖
        query = location.query || {}; // 路由path中的query
      }
      return { route: route, toPath: toPath, correct: correct, query: query
        // route 传入的参数对象
        // toPath 纯路由 下一步会进入的路由  不包含 ?q=1 等参数
        // correct 路由是否正确 若用 name 进入路由但是路由需要参数 则会将此参数变为false
        // query 路由的 query
      };
    }
  }, {
    key: 'transitionTo',
    value: function transitionTo(location, onComplete, onAbort) {
      // vue router 中的函数
      // 步骤
      // 1.根据 location 匹配路径
      // 2.有 onComplete 函数则运行
      // 3.更新 Route
      // 4.若有 read callBack 则运行
      // 5.若当前路由和想去的路由相同 则触发  onAbort 函数
      // location 可能是一个字符串也可能是一个对象 含有 path name param query 等

      var routeObj = this.parse(location); //匹配路径
      console.log(routeObj);
      if (routeObj.correct) {
        // 检验参数是否完整
        // 当 query 变化时 不是同一个path
        if (checkIsRepeat(addQuery(routeObj.toPath, routeObj.query))) {
          //与当前路由重复
          return onAbort && onAbort();
        }
        // 改变路由和组件
        onComplete(routeObj); // todo 加入生成的 route
        this.update(routeObj);
      } else {
        console.error('缺少参数的路径');
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
  }]);

  return Router;
}();

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
    var component = ref.parent._router.curView;
    // console.dir(router)
    // console.log('View render run')
    return h(component);
  }
};

function patch(path) {
  // 补全斜杠
  if (path.charAt(0) !== '/') {
    path = '/' + path;
  }
  if (path.charAt(path.length - 1) !== '/') {
    path = path + '/';
  }
  return path;
}

function path2Regexp(path) {
  var patt = new RegExp(/\/:.*?\//, "g");
  var result = void 0;
  var key = [];
  // 匹配 :参数
  while (result = patt.exec(path)) {
    key.push(path.substring(result.index, patt.lastIndex).slice(2, -2));
    var prev = path.substring(0, result.index);
    var next = path.substring(patt.lastIndex);
    path = prev + '\/.*?\/' + next;
  }
  return {
    match: path,
    key: key
  };
}

function matcher(routes, path) {
  path = patch(path);
  return foreach(routes, function (item) {
    if (path.match(new RegExp(item.match))) {
      if (item.path === '/' && path !== '/') {
        return 0;
      }
      return item;
    }
  });

  // 待加入未知数的value进routes里
  // 若path是 '/', 则会返回 '/' 路径;
  // 若不是, 当匹配到 '/' 时, 则会继续循环
}

function matcherByName(routes, name) {
  return foreach(routes, function (item) {
    if (item.name === name) {
      return item;
    }
  });
}

function splitQuery() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  // 将路由中的 query 分离出来
  var query = {};
  var check = path.indexOf('?');
  if (check > -1) {
    var arr = path.substr(check + 1).split('&');
    arr.forEach(function (i) {
      var poi = i.indexOf('=');
      query[i.substr(0, poi)] = i.substr(poi + 1);
    });
    path = path.substr(0, check);
  }

  return {
    path: path,
    query: query
  };
}

function checkIsRepeat(path) {
  return path === window.location.hash.substring(1);
}

function addQuery(path, query) {
  var q = '';
  for (var i in query) {
    q += '&' + encodeURIComponent(i) + '=' + encodeURIComponent(query[i]);
  }
  if (q) {
    return path + '?' + q.substr(1);
  }
  return path;
}

function pushHash(hash, params) {
  history.pushState(params || '', '', '#' + hash);
}

function replaceHash(hash, params) {
  history.replaceState(params || '', '', '#' + hash);
}

window.onhashchange = function (urlData) {
  console.log(urlData);
};

Router.install = function (Vue, options) {
  // 插件绑定 还未 new

  Vue.mixin({
    beforeCreate: function beforeCreate() {
      //检测是否有 router 参数，从而进行初始化的机会

      if (this.$options.router) {
        this._router = this.$options.router; // new App 接受的router
        this._router.init(this);
      } else {
        this._router = this.$parent._router;
        this.$router = this.$parent.$router;
        this.$route = Router.init$route(this);
      }
      Vue.util.defineReactive(this._router, 'curView', this._router.curView);
    }
  });
  Vue.component('router-view', View);
};

export default Router;
