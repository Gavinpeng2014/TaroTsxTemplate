import Taro from '@tarojs/taro'
// 持久化 状态管理器 ----------------- 存:异步处理, 取: 同步处理
const processor = {
    // 存储 支持同时多个存储
    set: (key:any,data?:any) => {
        if(typeof(key) === 'object') {
            Object.keys(key).map((item:any) => {
                Taro.setStorage({ key: item, data: key[item] })
            })
        } else {
            Taro.setStorage({ key, data })
        }
    },
    // 读取 key: 获取缓存的键, _default: 缓存中不存在返回默认值
    get: (key:string,_default:any = null) => {
        return Taro.getStorageSync(key) ? Taro.getStorageSync(key) : _default
    },
    // 清空缓存
    clear: () => {
        Taro.clearStorage()
    }
}

export default processor