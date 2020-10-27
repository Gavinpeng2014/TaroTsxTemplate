import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './testA.scss'

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
interface TestA {
    props: IProps
}
@connect(({ counter }) => ({ counter }),(dispatch) =>({  }))
class TestA extends Component {
    config = {
        navigationBarTitleText: 'weChat'
    }
    state = {}
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
        return (
            <View className="container testA">
                新页面创建模板风格-分包testA
            </View>
        );
    }
}

export default TestA as ComponentClass<PageOwnProps, PageState>