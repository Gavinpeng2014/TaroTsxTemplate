import processor from '../utils/processor'
import { ADD, MINUS, USERLOGIN, OUTLOGIN } from '../constants/counter'

const INITIAL_STATE = {
  // 示例
  num: 0,
  // 基础 小程序名称
  applets: '小程序名称',
  // 登陆状态
  loginState: processor.get('loginState',false),
  // 登陆凭证
  token: processor.get('token',''),
  // 用户信息
  userInfo: processor.get('userInfo',{})
}

export default function counter (state = INITIAL_STATE, action: any) {
  switch (action.type) {
    // 示例
    case ADD:
      return {
        ...state,
        num: state.num + 1
      }
    // 示例
    case MINUS:
      return {
        ...state,
        num: state.num - 1
      }
    // 用户登录
    case USERLOGIN:
      processor.set({ loginState: true, token: action.token, userInfo: action.userInfo })
      return {
        ...state,
        loginState: true,
        token: action.token,
        userInfo: action.userInfo
      }
    // 退出登录
    case OUTLOGIN: 
      processor.clear()
      return {
        ...state,
        loginState: false,
        token: '',
        userInfo: {}
      }
    default:
      return state
  }
}
