<template>
  <div class='home-container'>
       <!-- 导航 -->
       <!-- vant框架中使用原生js使用修饰符.native -->
    <van-nav-bar title="首页" fixed  @click-right="onClickRight">
       <van-icon name="search" slot="right" />
    </van-nav-bar>
  <!-- 内容
  1. tab切换
  2.list列表:加载更多+下拉刷新 -->
  <van-tabs @change="handleChangeTab" v-model="activeChannelIndex" class="channel-tabs" :lazy-render="false">
    <!-- 自定义按钮 -->
    <div slot='nav-right' class="wap-nav" @click="handleShowPopChannel">
      <van-icon name="wap-nav"></van-icon>
    </div>
    <!-- channels是当前激活频道 -->
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <van-pull-refresh :success-text="refreshSuccessText" v-model="item.downPullLoading" @refresh="onRefresh">

          <!-- 列表  van-list -->
          <van-list v-model="item.upPullLoading" :finished="item.upPullFinished" finished-text="没有更多了" @load="onLoad">
            <!--articles是当前激活频道的文章列表  -->
            <van-cell v-for="item in item.articles" :key="item.art_id.toString()" :title="item.title">
              <template slot="label">
                <!-- v-show:更新频繁 v-if:更新不频繁 -->
                <van-grid :border="false" :column-num="3" v-show="item.cover.type !== 0">
                  <van-grid-item v-for="src in item.cover.images" :key="src">
                    <!-- [图片懒加载] -->
                    <van-image :src="src" lazy-load />
                  </van-grid-item>
                </van-grid>
                <p>
                  <span>作者:{{item.aut_name}}</span>
                  &nbsp;
                  <span>评论:{{item.comm_count}}</span>
                  &nbsp;
                  <!-- | 是过滤器通道 -->
                  <span>{{item.pubdate | relTime}}</span>
                  &nbsp;&nbsp;&nbsp;
                  <van-icon style="float:right" class="close" name="cross" @click="showMoreActionDia(item)"></van-icon>
                </p>
              </template>
            </van-cell>
          </van-list>

        </van-pull-refresh>

      </van-tab>

    </van-tabs>
    <!-- 更多操作 -->
    <more-action @dislike-success="handleDislikeSuccess" v-model="isShowDiaMore" :currentArticle="currentArticle"></more-action>
    <Channels @delete-success="handleDeleteSuccess" @update:active-index="activeChannelIndex=$event" :activeChannelIndex="activeChannelIndex" :channels="channels" v-model="isShowPopChannel"></Channels>
  </div>
</template>

<script>
import { getChannelsUserOrDefault } from '@/api/channel.js'
import { getArticles } from '@/api/article.js'
import { mapState } from 'vuex'
import MoreAction from './components/more-action.vue'
import Channels from './components/channels.vue'
export default {
  name: 'HomeIndex',
  components: {
    MoreAction,
    Channels
  },
  data () {
    return {
      // 当前激活的频道索引
      activeChannelIndex: 0,
      channels: [], // 激活频道数据就是从这里取出来的
      // activeChannel: {} // 依赖channel和activeChannelIndex
      isShowDiaMore: false,
      isShowPopChannel: false,
      currentArticle: null,
      refreshSuccessText: ''
    }
  },
  created () {
    this.loadChannels()
  },
  // 检测store.state.user是否变化,如果变化就重新加载数据
  watch: {
    // 简化过程
    // list (newV, oldV) {}
    // list:(newV, oldV) => {}
    // 'list':() => {}
    // 凡是可以使用this.出来的数据,都可以使用watch监测
    //  this.$store.state.user -> mapState
    // 之后使用mapState-> user
    user (newV, oldV) {
      // 更新频道列表
      this.loadChannels()
      // 更新加载的动画
      this.activeChannel.upPullLoading = true
      // 更新文章列表
      this.onLoad()
    }
  },
  computed: {
    ...mapState(['user']),
    // 复杂依赖
    activeChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },
  methods: {
    // 点击右侧跳转
    onClickRight () {
      // console.log('-----')
      this.$router.push({ name: 'search' })
    },
    handleChangeTab () {
      // 在tab切换的时候进行手动更新数据
      this.onLoad()
    },
    handleDeleteSuccess () {
      if (!this.activeChannel.articles.length) {
      // 手动更新数据
        this.onLoad()
      }
    },
    handleShowPopChannel () {
      this.isShowPopChannel = true
    },
    handleDislikeSuccess () {
      // 应该发送得了特删除文章的请求 -> res -> 修改数据
      // 没有接口
      // 假删除
      const index = this.activeChannel.articles.findIndex((item) => {
        return item === this.currentArticle
      })
      // const currentArticle = this.currentArticle
      this.activeChannel.articles.splice(index, 1)
    },
    // 更多操作
    showMoreActionDia (currentArticle) {
      // 获取当前文章
      this.currentArticle = currentArticle
      this.isShowDiaMore = true
    },
    // 获取频道列表
    async loadChannels () {
      // 判断本地是否有数据
      const lsChannels = JSON.parse(window.localStorage.getItem('channels'))
      // console.log(lsChannels)
      try {
        // 简化写法1:
        if (this.user || (!this.user && !lsChannels)) {
          const data = await getChannelsUserOrDefault()
          data.channels.forEach(item => {
            // zai渲染之前,添加几个布尔值,为了使每个频道之间独立,不享用同一个变量
            item.downPullLoading = false // 当前频道下拉状态
            item.upPullLoading = false // 当前频道上拉加载更多
            item.upPullFinished = false // 当前频道加载完毕
            // 添加历史时间戳
            item.timestamp = Date.now() // 默认时间戳,为每个频道添加时间戳
            item.articles = [] // 为了控制每个频道自己的文章列表数据
          })
          this.channels = data.channels
        }
        if (!this.user && lsChannels) {
          this.channels = lsChannels
        }
      } catch (error) {
        console.dir(error)
      }
    },
    // 下拉刷新
    async onRefresh () {
      await this.$sleep(800)
      this.activeChannel.timestamp = Date.now()
      // 获取最新数据
      const data = await this.loadArticles()
      // 有最新数据
      if (data.results.length) {
        // 重置数据
        this.activeChannel.articles = data.results
        // 重置时间戳
        this.activeChannel.timestamp = data.pre_timestamp
        // 手动调用onLoad方法
        this.onLoad()
        this.refreshSuccessText = '更新完毕'
      }
      this.refreshSuccessText = '更新完成'
      // 停止动画
      this.activeChannel.downPullLoading = false
    },
    // 获取文章列表
    async loadArticles () {
      // 当前激活频道的id←当前激活的频道←activeChannel
      const { id: channel_id, timestamp } = this.activeChannel
      const data = await getArticles({
        // channel_id 是当前激活频道的id
        channel_id,
        // timestamp: Date.now(),
        // 在该方法被调用的时候返回来一个历史时间戳,在这里调用
        timestamp,
        with_top: 1
      })
      return data
    },
    // 加载更多的方法→可以自动加载,所以在这里调用loadArticles方法
    async onLoad () {
      // 自动触发loading
      // [延迟加载]→独立作用的函数→多次使用
      // 1. 函数
      // 2. 模块
      // 3. 挂载Vue的实例
      await this.$sleep(800)
      let data = []
      // 第一次发送请求只是为了验证,是否有数据
      data = await this.loadArticles()
      // console.log(data)
      if (data.pre_timestamp && data.results.length === 0) {
        this.activeChannel.timestamp = data.pre_timestamp
        // 根据有效时间戳,发送请求
        data = await this.loadArticles()
        // console.log(data)
      }
      // 所有数据加载完毕
      if (!data.pre_timestamp) {
        this.activeChannel.upPullLoading = false
        this.activeChannel.upPullFinished = true

        return
      }
      // !!! 当再次更新时,本身列表中是有数据的,但是要获取最新时间戳
      this.activeChannel.timestamp = data.pre_timestamp
      // 问题1: this.activeChannel.articles可能有上一页的历史数据,所以不能直接等于而是使用push去添加
      // 问题2: ...data.result 扩展出来是{},{},{}这样的形式,而push需要的就是这样的对象列
      this.activeChannel.articles.push(...data.results)
      // 获取完成,停止加载中动画
      this.activeChannel.upPullLoading = false
    }
  }
}

// [路由缓存]
/**
 * 使用Vue自带的标签<keep-alive></keep-alive> 进行路由缓存
 * 路由缓存-> 意思是切换路由时,在返回上一个路由时,状态不改变
 * 注意:keep-alive 标签要慎用,因为它会直接跳过钩子函数,导致频道列表无法刷新
 * 解决:手动更改使列表刷新
 */

// [时间处理]
/**
 * 1. moment.js
 * 时间格式处理需要处理-> moment.js
 * 2. day.js
 * 优点:
 * 1) 和momentjsAPI一样
 * 2) 大小只有2k
 */
</script>

<style scoped lang='less'>
// 1. scoped作用当前作用域
// 2. 深度选择 -> /deep/
// 补充: /deep/ 的另一种写法 >>> → 和css 预处理器不兼容
// 调整tabs样式
.channel-tabs {
  margin-bottom: 100px;
}
// 调整tab栏的位置
.channel-tabs /deep/ .van-tabs__wrap {
  position: fixed;
  top: 92px; // 46 *2 -> 92
  width: 100%;
  z-index:99;
}
// 调整tabs的内容的位置
.channel-tabs /deep/ .van-tabs__content {
  margin-top: 92px * 2;
}
.van-nav-bar {
    background-color: #0096fa;
    .van-nav-bar__title {
        color: white;
    }
    .van-icon-search {
      color:#fff;
      font-size:40px;
    }
}
.channel-tabs /deep/ .wap-nav {
  position: fixed;
  right: 0px;
  background-color: #fff;
  width: 80px;
  line-height: 92px;
  text-align: center;
  font-size: 70px;
}
.wap-navb {
  width: 200px;
}
</style>
