import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// v1.引入工具包, Validator 是语言包
import VeeValidate, { Validator } from 'vee-validate'

// 静态资源
import '@/style/index.css'

// 插件
import Vant from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible/index.min.js'
// v2. 导入语言包
import zhCN from 'vee-validate/dist/locale/zh_CN'
Vue.use(Vant)
Vue.use(VeeValidate)
// v3. 加载语言包
Validator.localize('zh_CN', zhCN)
// 自定义规则
Validator.extend('phone', {
  getMessage: field => field + ' 格式不正确',
  validate: value => {
    // 提示: 实际正则不需要写
    return (
      value.length === 11 && /^((13|15|16|18|19)[0-9]{1})\d{8}$/.test(value)
    )
  }
})

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
