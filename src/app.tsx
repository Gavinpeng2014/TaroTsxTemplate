import '@tarojs/async-await'
import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'

import configStore from './store'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    "pages": [
      // 首页
      "pages/index/index",
      // 临时文件
      "pages/temporary/temporary",
      // 登陆页
      "pages/login/login"
    ],
    "window": {
      "backgroundTextStyle": "light",
      "navigationBarBackgroundColor": "#fff",
      "navigationBarTitleText": "WeChat",
      "navigationBarTextStyle": "black"
    },
    "tabBar": {
      "selectedColor": "#07c160",
      "list": [
        {
          "pagePath": "pages/index/index",
          "text": "Tab1",
          "iconPath": "assets/tabBar/2.png",
          "selectedIconPath": "assets/tabBar/2-1.png"
        },
        {
          "pagePath": "pages/temporary/temporary",
          "text": "Tab2",
          "iconPath": "assets/tabBar/3.png",
          "selectedIconPath": "assets/tabBar/3-1.png"
        }
      ]
    },
    "subPackages": [
      {
        "root": "packageA",
        "pages": [
          "test/testA/testA"
        ]
      },
      {
        "root": "packageB",
        "pages": [
          "test/testA/testA"
        ]
      },
      {
        "root": "packageC",
        "pages": [
          "test/testA/testA"
        ]
      },
      {
        "root": "packageD",
        "pages": [
          "test/testA/testA"
        ]
      },
      {
        "root": "packageE",
        "pages": [
          "test/testA/testA"
        ]
      },
    ],
    "networkTimeout": {
      "request": 20000,
      "connectSocket": 20000,
      "uploadFile": 20000,
      "downloadFile": 20000
    },
    "permission": {
      "scope.userLocation": {
        "desc": "您的位置信息将用于小程序位置接口效果演示"
      }
    }
  }

  componentDidMount () {
    // 版本更新管理器
    if (Taro.canIUse('getUpdateManager')) {
      const updateManager = Taro.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            Taro.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            Taro.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      Taro.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
