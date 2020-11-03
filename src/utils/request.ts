import Taro from '@tarojs/taro'

/**
 * 域名 - 读取  config  公共配置
 */
const api = process.env.DOMAIN_NAME

/**
 * 屏蔽接口报错不提示 白名单接口
 */
const screening = [
    // 示例
    '/test'
]

/**
 * 免跳转登陆页  白名单接口
 */
const noGoLogin = [
    // 示例
    '/test'
]

/**
 * 请求
 * @param params {}
 * @param params.loading 加载动画
 * @param params.loadingText 加载提示语句
 * @param params.url 接口地址
 * @param params.method 请求方式
 * @param params.data 请求参数
 * @param params.header 请求头
 */
const Request = (params:any) => {
    if(params.loading) Taro.showLoading({ title: `${ params.loadingText ? params.loadingText : 'Loading..' }`, mask: true })
    return new Promise((resolve, reject) => {
        Taro.request({
            url: api + params.url,
            method: params.method ? params.method : 'GET',
            data: params.data,
            header: params.header,
            success: res => {
                if(params.loading) Taro.hideLoading()
                // 需要与后端协商定义管理返回状态值
                switch(res.data.code) {
                    case 200: 
                        // 成功返回
                        resolve(res)
                        break
                    case 401:
                        // 登陆状态 过期
                        if(noGoLogin.indexOf(params.url) < 0) {
                            Taro.showModal({
                                title: '温馨提示',
                                content: '登陆已过期,请重新登陆',
                                confirmText: '重新登陆',
                                showCancel: false,
                                success: res => {
                                    if(res.confirm) {
                                        // 重新登陆
                                        Taro.navigateTo({ url: '/pages/login/login' })
                                    }
                                }
                            })
                        }
                        break;
                    default: 
                        // 以上验证均不通过
                        reject(res)
                        // 前端是否需要 Toast 显示错误信息
                        if(screening.indexOf(params.url) < 0) {
                            Taro.showToast({
                                title: res.data.msg || 'No error message returned!',
                                icon: 'none'
                            })
                        }
                }
            },
            fail: err => {
                if(params.loading) Taro.hideLoading()
                reject(err)
            }
        })
    })
}


export { 
    Request   
}