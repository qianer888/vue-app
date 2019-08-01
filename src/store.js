import Vue from 'vue'
import Vuex from 'vuex'

// 导入 auth
import * as auth from '@/utils/auth.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // user:存储包含token 在内的 数据对象
    // 第一次是空的
    user: auth.getUser()
  },
  mutations: {
    // 修改state中的user值为data形参值
    setUser (state, data) {
      // 修改state.user,data赋值给获取到的user
      state.user = data
      // 更新ls中的token
      auth.setUser(state.user)
    }
  },
  actions: {

  }
})
