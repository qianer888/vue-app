<template>
  <div class='result-container'>
    <!-- <p>{{$route.params.q}}</p> -->
    <van-nav-bar
        fixed
        title="搜索结果"
        left-text="返回" left-arrow @click-left="$router.back()"></van-nav-bar>
        <van-list class="search-list" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="item in resultdata" :key="item.art_id" :title="item.title" />
        </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search.js'
export default {
  name: 'search-result',
  data () {
    return {
      resultdata: [],
      page: 1,
      per_page: 10,
      list: [],
      loading: false,
      finished: false
    }
  },
  // created () {
  //   this.loadSearchResult()
  // },
  deactivated () {
    // keep-alive 停用时调用-> 缓存刚做完触发 -> 此时有缓存
    // 清除缓存的组件-> 干掉组件
    // 当前组件-> this-> 当前Vue构造函数的实例化对象-> Vue实例-> Vue实例对象
    this.$destroy()
  },
  computed: {
    q () {
      return this.$route.params.q
    }
  },
  // 当前组件接收了外部传入的路由数据 -> 应该转为自己的数据
  methods: {
    // 一进来就加载
    async onLoad () {
      await this.$sleep(800)
      try {
        const data = await getSearchResult({
          page: this.page,
          per_page: this.per_page,
          q: this.q
        })
        // console.log(data)
        if (data.results.length === 0) {
          this.finished = true
          this.loading = false
        } else {
          this.resultdata.push(...data.results)
          this.page++
          this.loading = false
        }
      } catch (error) {
        console.dir(error)
      }
    },
    // 获取结果列表
    async loadSearchResult () {
      try {
        const data = await getSearchResult({
          q: this.q
        })
        // console.log(data)
        this.resultdata = data.results
      } catch (error) {
        console.dir(error)
      }
    }
  }
}

// [路由缓存]
// 使用vue的keep-alive,vue自带的组件-> 需要清除-> 组件的钩子函数不会二次触发
</script>

<style scoped lang='less'>
.search-list {
  margin-top: 92px;
}</style>
