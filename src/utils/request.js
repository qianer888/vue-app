import axios from 'axios'
import store from '@/store.js'
import router from '@/router.js'
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
}, async error => {
  return Promise.reject(error)
})
// 设置响应拦截器
request.interceptors.response.use(function (response) {
  // 如果响应结果对象中有 data，则直接返回这个 data 数据
  // 如果响应结果对象中没有 data，则不作任何处理，直接原样返回这个数据
  return response.data.data || response.data
}, async error => {
  console.dir(error)
  const { user } = store.state
  if (error.response.status === 401) {
    // ① pc端方法
    // removeUser()
    // this.$router.push({ name: 'login' })

    // ② 使用refresh_token刷新token
    // 是否有用户
    if (!user) {
      // 去登陆
      router.push({ name: 'login' })
    } else {
      // 使用用户中的refresh_token刷新token
      try {
        // 发送请求
        // const data = await request({}) ===> 在这里 调用了自身-> 进入了请求拦截器 -> 又报错 -> 进入无限循环
        const { data } = await axios({
          method: 'PUT',
          url: `http://ttapi.research.itcast.cn/app/v1_0/authorizations`,
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })
        // 获取到token
        // console.log(data.data.data.token)
        // 处理返回的数据,里面有新的token -> 交给store
        // 如果想要更新store中的数据应该先交给action-> mutation -> state
        store.commit('setUser', {
          token: data.data.token,
          refresh_token: user.refresh_token
        })
        // 返回响应 -> 把之前的造成失效的请求,进行发送
        // 当前的这次请求在error对象中的config
        // 此时的request中的token已经更新,并且这次一定要用request,因为它会重新完成刚失败的请求
        return request(error.config)
      } catch (error) {
        router.push({ name: 'login' })
      }
    }
  }
  return Promise.reject(error)
})

export default request

// 疑问: export 和 export default 是什么区别
