<template>
  <div class='container'>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

<!-- 首页,我的 -->
<!-- route:触发路由变化 -->
    <van-tabbar active-color="#07c160" inactive-color="#000" v-model="activeIndex" route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="search" to="/mine">{{!$store.state.user?'未登录':'我的'}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: 1
    }
  }
}
</script>

<style scoped lang='less'></style>
