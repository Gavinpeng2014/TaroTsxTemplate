import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

declare global {
    namespace JSX {
        interface IntrinsicElements {
            parser: any
        }
    }
}

import { connect } from '@tarojs/redux'
// import {  } from '../../actions/counter'
type PageStateProps = {
    counter: {}
}
type PageDispatchProps = {

}
type PageOwnProps = {}
type PageState = {}
type IProps = PageStateProps & PageDispatchProps & PageOwnProps
interface Index {
    props: IProps
}
@connect(({ counter }) => ({ counter }),(dispatch) =>({  }))
class Index extends Component {
    config = {
        navigationBarTitleText: 'weChat',
        usingComponents: {
            //引入富文本插件包
            'parser': '../../assets/parser/parser' 
        }
    }
    state = {
        // 富文本内容
        html: '<p>p标签</p><span>span标签<span><div>div标签</div>',
        // 富文本插件内 标签样式设置
        tagStyle: {
            video: 'width: 100%;'
        }
    }
    componentWillMount() { }
    componentDidMount() { }
    componentWillReceiveProps(nextProps, nextContext) { }
    componentWillUnmount() { }
    componentDidShow() { }
    componentDidHide() { }
    componentDidCatchError() { }
    componentDidNotFound() { }
    //--------- 自定义方法
    render() {
        const { html, tagStyle } = this.state
        return (
            <View className='container Index'>
                新页面创建模板风格
                <View className=''>
                    <parser html={ html } tag-style={ tagStyle }/>
                </View>
            </View>
        );
    }
}

export default Index as ComponentClass<PageOwnProps, PageState>