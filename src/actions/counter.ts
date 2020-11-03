import {
  ADD,
  MINUS,
  USERLOGIN,
  OUTLOGIN
} from '../constants/counter'
/**
 * 示例 触发指令 ADD
 */
const add = () => {
  return {
    type: ADD
  }
}
/**
 * 示例 触发指令 MINUS
 */
const minus = () => {
  return {
    type: MINUS
  }
}
/**
 * 示例 异步触发指令 add
 */
const asyncAdd = () => {
  return (dispatch:any) => {
    setTimeout(() => {
      dispatch(add())
    }, 2000)
  }
}
/**
 * 用户登陆
 */
const userLogin = (token:string,userInfo:any) => {
  return {
    type: USERLOGIN,
    token,
    userInfo
  }
}
/**
 * 退出登录
 */
const outLogin = () => {
  return {
    type: OUTLOGIN
  }
}

export {
  // 示例 触发指令 ADD
  add,
  // 示例 触发指令 MINUS
  minus,
  // 示例 异步触发指令 add
  asyncAdd,
  // 用户登录
  userLogin,
  // 退出登录
  outLogin
}
