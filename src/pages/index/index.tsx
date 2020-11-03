import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { Request } from '../../utils/request'
import './index.scss'

declare global {
    namespace JSX {
        interface IntrinsicElements {
            parser: any
        }
    }
}

import { connect } from '@tarojs/redux'
import { add, minus, outLogin } from '../../actions/counter'
type PageStateProps = {
    counter: {
        num: number,
        loginState: boolean,
        token: string
    }
}
type PageDispatchProps = {
    add: () => void
    minus: () => void,
    outLogin: () => void
}
type PageOwnProps = {}
type PageState = {}
type IProps = PageStateProps & PageDispatchProps & PageOwnProps
interface Index {
    props: IProps
}
@connect(({ counter }) => ({ counter }),(dispatch) =>({ 
    add() {
        dispatch(add())
    },
    minus() {
        dispatch(minus())
    },
    outLogin() {
        dispatch(outLogin())
    }
}))
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
    componentWillMount() { 
        this.testRequire();
    }
    componentDidMount() { }
    componentWillReceiveProps() { }
    componentWillUnmount() { }
    componentDidShow() { }
    componentDidHide() { }
    componentDidCatchError() { }
    componentDidNotFound() { }
    //--------- 自定义方法
    /**
     * 测试请求
     */
    testRequire() {
        Request({
            url: '/test',
            data: { test: 1 },
            loading: true,
            loadingText: '加载中...'
        }).then((res:any) => {
            console.log(res)
        }).catch((err:any) => { console.log(err) })
    }
    /**
     * 去登陆
     */
    goLogin() {
        Taro.navigateTo({ url: '/pages/login/login' })
    }
    render() {
        const { html, tagStyle } = this.state
        const { num, loginState, token } = this.props.counter
        return (
            <View className='container index'>
                <View>Hellow Word!</View>
                <View>
                    <parser html={ html } tag-style={ tagStyle }/>
                </View>
                <View className='num'>当前num: { num }</View>
                <Button onClick={ this.props.add }>num+</Button>
                <Button onClick={ this.props.minus }>num-</Button>
                <View>当前token: { token }</View>
                {
                    loginState 
                    ? <Button onClick={ this.props.outLogin }>退出登录</Button>
                    : <Button onClick={ () => this.goLogin()  }>去登陆</Button>
                }
            </View>
        );
    }
}

export default Index as ComponentClass<PageOwnProps, PageState>