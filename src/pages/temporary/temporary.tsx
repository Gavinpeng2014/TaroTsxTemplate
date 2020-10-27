import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './temporary.scss'

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
interface Temporary {
    props: IProps
}
@connect(({ counter }) => ({ counter }),(dispatch) =>({  }))
class Temporary extends Component {
    config = {
        navigationBarTitleText: 'Temporary'
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
            <View className="container temporary">
                新页面创建模板风格temporary
            </View>
        );
    }
}

export default Temporary as ComponentClass<PageOwnProps, PageState>