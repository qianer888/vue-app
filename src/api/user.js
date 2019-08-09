/**
 * 用户相关数据请求
 *  好处:1. 好维护,统一管理 2. 可复用
 * 遵循:不要直接在组件中发送请求,最好都封装成函数进行调用
 */

// 导入request
import request from '@/utils/request.js'

// 登录
export const login = ({
  mobile, code
}) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}

// 关注和取消关注
export const starUser = (user_id) => {
  return request({
    method: 'post',
    url: `/app/v1_0/user/followings`,
    data: {
      target: user_id
    }
  })
}

export const unstarUser = user_id => {
  return request({
    method: 'delete',
    url: `/app/v1_0/user/followings/${user_id}`
  })
}
