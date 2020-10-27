"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require("./npm/@tarojs/async-await/index.js");

var _index = require("./npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("./npm/@tarojs/redux/index.js");

var _index4 = require("./store/index.js");

var _index5 = _interopRequireDefault(_index4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }
var store = (0, _index5.default)();
(0, _index3.setStore)(store);

if (_index3.ReduxContext.Provider) {
  _index3.ReduxContext.Provider({
    store: store
  });
  _index3.ReduxContext.Provider({
    store: store
  });
}

var _App = function (_BaseComponent) {
  _inherits(_App, _BaseComponent);

  function _App() {
    _classCallCheck(this, _App);

    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    var _this = _possibleConstructorReturn(this, (_App.__proto__ || Object.getPrototypeOf(_App)).apply(this, arguments));

    _this.config = {
      'pages': [
      // 首页
      'pages/index/index',
      // 临时文件
      'pages/temporary/temporary'],
      'window': {
        'backgroundTextStyle': 'light',
        'navigationBarBackgroundColor': '#fff',
        'navigationBarTitleText': 'WeChat',
        'navigationBarTextStyle': 'black'
      },
      'tabBar': {
        'selectedColor': '#07c160',
        'list': [{
          'pagePath': 'pages/index/index',
          'text': 'Tab1',
          'iconPath': 'assets/tabBar/2.png',
          'selectedIconPath': 'assets/tabBar/2-1.png'
        }, {
          'pagePath': 'pages/temporary/temporary',
          'text': 'Tab2',
          'iconPath': 'assets/tabBar/3.png',
          'selectedIconPath': 'assets/tabBar/3-1.png'
        }]
      },
      'subPackages': [{
        'root': 'packageA',
        'pages': ['test/testA/testA']
      }, {
        'root': 'packageB',
        'pages': ['test/testA/testA']
      }, {
        'root': 'packageC',
        'pages': ['test/testA/testA']
      }, {
        'root': 'packageD',
        'pages': ['test/testA/testA']
      }, {
        'root': 'packageE',
        'pages': ['test/testA/testA']
      }],
      'networkTimeout': {
        'request': 20000,
        'connectSocket': 20000,
        'uploadFile': 20000,
        'downloadFile': 20000
      },
      'permission': {
        'scope.userLocation': {
          'desc': '您的位置信息将用于小程序位置接口效果演示'
        }
      }
    };
    return _this;
  }

  _createClass(_App, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // 版本更新管理器
      if (_index2.default.canIUse('getUpdateManager')) {
        var updateManager = _index2.default.getUpdateManager();
        updateManager.onCheckForUpdate(function (res) {
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              _index2.default.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function success(res) {
                  if (res.confirm) {
                    updateManager.applyUpdate();
                  }
                }
              });
            });
            updateManager.onUpdateFailed(function () {
              _index2.default.showModal({
                title: '已经有新版本了哟~',
                content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
              });
            });
          }
        });
      } else {
        _index2.default.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        });
      }
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {}
  }, {
    key: "componentDidHide",
    value: function componentDidHide() {}
  }, {
    key: "componentDidCatchError",
    value: function componentDidCatchError() {}
    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数

  }, {
    key: "_createData",
    value: function _createData() {}
  }]);

  return _App;
}(_index.Component);

exports.default = _App;

App(require('./npm/@tarojs/taro-weapp/index.js').default.createApp(_App));
_index2.default.initPxTransform({
  "designWidth": 750,
  "deviceRatio": {
    "640": 1.17,
    "750": 1,
    "828": 0.905
  }
});