<template>
<div class="login-wrap">
  <!-- <input v-validate="'required|phone'" name="phone" type="text">
  <span>{{ errors.first('phone') }}</span> -->
    <div class="login">
         <!--1. 关键字: 导航-->
        <van-nav-bar title="登录" />
        <!-- 2. 表单 -->
        <form action="/" method="POST">
            <van-cell-group>
            <van-field  :error-message="errors.first('phone')" v-validate="'required|phone'" name="phone" v-model="user.mobile" required clearable label="手机号" placeholder="请输入手机号"  />
            <van-field v-model="user.code" type="password" label="密码" placeholder="请输入密码" required />
            </van-cell-group>
            <van-button type="info" block @click.prevent="getLogin" :loading="isLoading">登录</van-button>
        </form>
    </div>
</div>
</template>

<script>
// import axios from 'axios'
// 导入 user
import { login } from '@/api/user.js'
// 调用存储token
// import { setUser } from '@/utils/auth.js'
import { mapMutations } from 'vuex'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '15640826921',
        code: '246810'
      },
      isLoading: false
    }
  },
  methods: {
    //
    ...mapMutations(['setUser']),
    // 1. 点击登录发送ajax
    async getLogin () {
      this.isLoading = true
      try {
        this.$validator.validate().then(async valid => {
          if (!valid) {
            return
          }
          const res = await login(this.user)
          this.setUser(res)
          this.isLoading = false
          // 进入tabbar组件
          this.$router.push({
            path: '/'
          })
        })
      // console.log(res)
      // 2. 请求发送完毕,得到token,需要保存token信息
      // setUser(res)
      // 3. 已经可以存储token了, 因为多个组件需要共享token,所以需要使用vuex,实现数据共享
      } catch (error) {

      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap {
    position: absolute;
    background: rgba(0,0,0,0.2);
    height: 100%;
    width:100%;
    .login {
        position: absolute;
        width: 600px;
        height:600px;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
        border-radius: 10px;
        overflow: hidden;
        .van-nav-bar {
          background-color: #0096fa;
          .van-nav-bar__title {
              color: white;
          }
      }
    }
}

</style>
