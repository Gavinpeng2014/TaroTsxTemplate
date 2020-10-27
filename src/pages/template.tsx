import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './xxx.scss'

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
interface Xxx {
    props: IProps
}
@connect(({ counter }) => ({ counter }),(dispatch) =>({  }))
class Xxx extends Component {
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
            <View className='container xxxx'>
                新页面创建模板风格
            </View>
        );
    }
}

export default Xxx as ComponentClass<PageOwnProps, PageState>