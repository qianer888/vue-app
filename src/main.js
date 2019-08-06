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
// [图片懒加载]
import VueLazyload from 'vue-lazyload'
// [时间格式化]
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // [时间格式化-> 相对时间]
import 'dayjs/locale/zh-cn' // [时间格式化-> 语言包]

// v2. 导入语言包
import zhCN from 'vee-validate/dist/locale/zh_CN'
Vue.use(Vant)
Vue.use(VeeValidate)
Vue.use(VueLazyload)
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
// v3. 加载语言包
Validator.localize('zh_CN', zhCN)

// v4. 自定义规则
Validator.extend('phone', {
  getMessage: field => field + ' 格式不正确',
  validate: value => {
    // 提示: 实际正则不需要写
    return (
      value.length === 11 && /^((13|15|16|18|19)[0-9]{1})\d{8}$/.test(value)
    )
  }
})

// [延迟加载] 与业务逻辑无关,仅仅是为了延缓显示效果
// 解决异步代码,后续代码不等待
// cb
// promise
// 2.1 一个promise对应一个异步
// 2.2 .then() .catch()
// async await
Vue.prototype.$sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

// [时间格式化]测试代码
// console.log(dayjs().format()) // 当前时间
// console.log(dayjs().from(dayjs('1990'))) // 2 years ago // 相对时间
// console.log(dayjs('2018-05-05').locale('zh-cn').format()) // 时间中文化
// console.log(dayjs().locale('zh-cn').from(dayjs('2018-05-05')))

// 时间格式化过滤器
Vue.filter('relTime', (value) => {
  return dayjs().locale('zh-cn').from(value)
})

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
