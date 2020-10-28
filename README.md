# TaroTsxTemplate trao-cli@1.3

## 项目简介
```
1.模板适用于快速搭建简单项目开发使用
2.项目技术栈 Taro + redux + tsx 
3.模板初始中共有5个分包可继续添加,注意单包大小不得超过2M,整包大小(包括主包在内)不得大于微信限制[在小程序IDE右上角详情查看'项目配置 - 高级配置']
4.模板分包中初始定义了一个testA文件,当分包真正被使用后含有至少一个文件,可自行删除test文件夹
5.对请求进行初步封装
6.模板中已有 Parser富文本插件 微信小程序版 tsx 中 usingComponents 引入组件IDE会报错在页面中复制以下代码即可
    declare global {
        namespace JSX {
            interface IntrinsicElements {
                parser: any
            }
        }
    }
    实用功能示例 <parser html={ html } tag-style={ tagStyle }/> state 中定义 tagStyle:{ video: 'width: 100%;' } 设置富文本插件内 标签样式设置
    插件官网地址: https://jin-yufeng.github.io/Parser/#/
```
### 介绍项目中 redux 简单快捷使用方式(还没理解 redux 的同学可以暂时这样理解使用,有兴趣的同学可以自行研究)
```
1.constants/constants.ts ---------- 定义 action type 常量
2.actions/counter.ts -------------- 定义函数对应指令
3.reducers/counter.ts ------------- reducers 管理默认存储状态, 通过 页面触发 actions 指令更新 存储状态
4.使用默认模板文件 template.tsx 文件创建的页面可快捷使用或体验 redux 
5. type PageStateProps = { counter: {} } 中写入需要用到存在 reducers 中的状态, 可通过 this.props.counter.xxx 在页面中使用
6. type PageDispatchProps = { xxx: () => void } 输出 actions 指令
7. @connect(({ counter }) => ({ counter }),(dispatch) =>({ xxx() { dispatch(xxx())} })) 给页面提供调用方式 this.props.xxx()
```

### 任何问题或有误人子弟的地方还请多多指教
```
Author: Gavin
QQ: 3020990880
WeChat: Gavinpeng0831
Email: Gavinpengemall@vip.qq.com
Des: If you don't go forward, you don't know the distance; if you don't study hard, you don't understand the truth.
```