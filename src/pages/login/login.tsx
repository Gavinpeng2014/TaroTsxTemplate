import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, OpenData, Button } from '@tarojs/components'
import { Request } from '../../utils/request'
import './login.scss'

import { connect } from '@tarojs/redux'
import { userLogin } from '../../actions/counter'
type PageStateProps = {
    counter: {
        applets: string
    }
}
type PageDispatchProps = {
    userLogin: (token:string,userInfo:any) => void
}
type PageOwnProps = {}
type PageState = {}
type IProps = PageStateProps & PageDispatchProps & PageOwnProps
interface Login {
    props: IProps
}
@connect(({ counter }) => ({ counter }),(dispatch) =>({ 
    userLogin(token:string,userInfo:any) {
        dispatch(userLogin(token,userInfo))
    }
}))
class Login extends Component {
    config = {
        navigationBarTitleText: '授权登陆'
    }
    state = {
        // 临时授权票据
        code: ''
    }
    componentWillMount() {
        this.getWxLogin()
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
     * 获取code
     */
    getWxLogin() {
        let that = this
        Taro.login({ success: (result:any) => { that.setState({ code: result.code }) } }) 
    }
    /**
     * 微信授权登陆
     */
    bindGetUserInfo(e:any) {
        let that = this
        if(e.detail.userInfo) {
            // 用户允许
            let { encryptedData, iv } = e.detail
            that.auto_login({ encryptedData, iv })
        } else {
            // 用户拒绝
            Taro.showToast({ title: '授权登陆取消', icon: 'none' })
        }
    }
    /**
     * 请求后端 登陆 换取 token
     * @param params 接收 object
     * @param params.encryptedData 加密数据(小程序端)
     * @param params.iv 加密算法的初始向量(小程序端)
     */
    auto_login(params:any) {
        let that = this,
            { code } = that.state
        //---------模拟登陆成功 S
        Taro.showLoading({ title: '授权中', mask: true })
        setTimeout(() => {
            Taro.hideLoading()
            let simulationUserInfo = {
                nickName: 'Gavin',
                gender: 1,
                language: 'zh_CN',
                city: '',
                province: '',
                country: 'Yemen',
                avatarUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/jXxJDdtMKcZQoRfiaRBaPUn6ebEPFFxiaFYggKiaKV2ib4cELXdTasm73pICCGK01tDnN0DaOpaBq1Tta8CFrztSJw/132'
            },
            simulationToken = '00sd6fw8e4f98we4f94ea84f8'
            that.props.userLogin(simulationToken,simulationUserInfo)
            //获取已加载的页面栈
            let pages = Taro.getCurrentPages() 
            if(pages.length > 1) {
                Taro.navigateBack()
            } else {
                Taro.reLaunch({
                    url: '/pages/index/index'
                })
            }
        }, 2000);
        //---------模拟登陆成功 E
        return false
        Request({
            url: '/authLogin',
            method: 'POST',
            data: { code, ...params },
            loading: true,
            loadingText: '加载中...'
        }).then((res:any) => {
            console.log(res)
        }).catch((err:any) => { console.log(err) })
    }
    render() {
        const { applets } = this.props.counter
        return (
            <View className='container login'>
                <View className='login-head'>
                    <View className='avatar'>
                        <OpenData type='userAvatarUrl'/>
                    </View>
                    <View className='userName'>
                        <OpenData type='userNickName'/>
                    </View>
                </View>
                <View className='login-main'>
                    <View className='title'>{ applets }申请获得以下权限</View>
                    <View className='explain'>获得您的公开信息(昵称，头像等)</View>
                </View>
                <View className='login-footer'>
                    <Button className='btn' hoverClass='hoverClass' open-type='getUserInfo' onGetUserInfo={ e => this.bindGetUserInfo(e) }>确认授权并登陆</Button>
                </View>
            </View>
        );
    }
}

export default Login as ComponentClass<PageOwnProps, PageState>