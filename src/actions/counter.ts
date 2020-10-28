import {
  ADD,
  MINUS
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

export {
  // 示例 触发指令 ADD
  add,
  // 示例 触发指令 MINUS
  minus,
  // 示例 异步触发指令 add
  asyncAdd
}
