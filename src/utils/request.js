import axios from 'axios'
import store from '@/store.js'
import JSONBig from 'json-bigint'
// 设置baseURL 并返回axios实例对象→request
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

request.defaults.transformResponse = [function (data) {
  try {
    return JSONBig.parse(data)
  } catch (error) {
    return data
  }
}]

// 设置请求拦截器
request.interceptors.request.use(function (config) {
  // 如果是非登录请求→设置请求头
  const { user } = store.state

  config.url !== '/app/v1_0/authorizations' && user && (config.headers.Authorization = `Bearer ${user.token}`)

  // if (config.url !== '/app/v1_0/authorizations') {
  //   // 如果用户登录了 -> token
  //   if (user) {
  //     config.headers.Authorization = `Bearer ${user.token}`
  //   }
  // }

  return config
}, function (error) {
  return Promise.reject(error)
})
// 设置响应拦截器
request.interceptors.response.use(function (response) {
  // 如果响应结果对象中有 data，则直接返回这个 data 数据
  // 如果响应结果对象中没有 data，则不作任何处理，直接原样返回这个数据
  return response.data.data || response.data
}, function (error) {
  return Promise.reject(error)
})

export default request

// 疑问: export 和 export default 是什么区别
