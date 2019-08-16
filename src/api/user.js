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

// 用户信息
export const getUserInfo = () => {
  return request({
    method: 'get',
    url: `/app/v1_0/user`
  })
}
// 获取个人资料

export const getCurrentUserInfo = () => {
  return request({
    method: 'get',
    url: `/app/v1_0/user/profile`
  })
}

// 编辑个人用户资料
// name string 非必须 昵称
// photo string 非必须 头像 base64编码处理
// gender intege 非必须 性别，0-男，1-女
// birthday string 非必须 生日，格式'2018-12-20'
// real_name string 非必须 真实姓名
// id_number string 非必须 身份证号
// id_card_front string 非必须 身份证正面照片 base64编码处理
// id_card_back string 非必须 身份证背面照片 base64编码处理
// id_card_handheld string 非必须 手持身份证照片 base64编码处理
// intro string 非必须 个人介绍
export const patchCurrentUserInfo = ({
  name,
  photo,
  gender,
  birthday,
  real_name,
  id_number,
  id_card_front,
  id_card_back,
  id_card_handheld,
  intro
}) => {
  return request({
    method: 'PATCH',
    url: `/app/v1_0/user/profile`,
    data: {
      name,
      photo,
      gender,
      birthday,
      real_name,
      id_number,
      id_card_front,
      id_card_back,
      id_card_handheld,
      intro
    }
  })
}

// 编辑用户个人资料
/**
 *  photo file 否 头像
    id_card_front file 否 身份证正面照片
    id_card_back file 否 身份证背面照片
    id_card_handheld file 否 手持身份证照片
 */
/**
 * {
  photo,
  id_card_front,
  id_card_back,
  id_card_handheld
}
 */
export const updateUser = (name, file) => {
  // 当 content-type要求的值 -> formdata,此时把form打他类型的数据传递给data数据
  const formdata = new FormData()
  // formdata.append('要修改的字段名',数据值)
  formdata.append(name, file)

  return request({
    method: 'patch',
    url: `/app/v1_0/user/photo`,
    data: formdata
  })
}
