<template>
  <van-popup
  :value="value"
  @input="$emit('input',$event)"
  position="bottom"
  :style="{ height: '95%' }"
  >
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">我的频道</span>
          <span class="desc">点击进入频道</span>
        </div>
        <div>
          <van-button
            type="danger"
            plain
            size="mini"
            @click="isEdit=!isEdit"
          >{{!isEdit?'编辑':'完成'}}</van-button>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item
          v-for="(item,index) in channels"
          :key="item.id"
          text="文字"
          @click="handleClickChannel(item,index)">
          <span class="text" :class="{active:activeChannelIndex===index&&!isEdit}">{{item.name}}</span>
          <van-icon class="close-icon" name="close" v-show="isEdit===true && index!==0" />
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 推荐频道 -->
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">频道推荐</span>
          <span class="desc">点击添加频道</span>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item
          v-for="(item,index) in restChannels"
          :key="item.id"
          text="文字"
          @click="handleAddClick(item,index)">
          <div class="info">
            <span class="text">{{item.name}}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
  </van-popup>
</template>

<script>
import { getAllChannels, resetChannels, delUserChannels } from '@/api/channel.js'
import { mapState } from 'vuex'
export default {
  name: 'HomeChannel',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    channels: {
      type: Array,
      default: () => []
    },
    activeChannelIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 全部频道
      allChannels: [],
      isEdit: false

    }
  },
  computed: {
    // 筛选后的频道
    restChannels () {
      // 目的:把allChannels中的channels数据筛选出来
      // map 1. 能遍历 2. 传cb 3.cb形参是元素 4. return 条件 5. 把所有条件的放在新数组中返回
      const ids = this.channels.map((item) => {
        return item.id
      })
      // filter 新数组中的元素是通过检查指定数组中符合条件的所有元素。
      // 1. 能遍历 2.传cb 3.cb形参是元素
      return this.allChannels.filter((item) => {
        //  const a = ids.includes(item.id) // 取不包含
        return !ids.includes(item.id)
      })
    },
    ...mapState(['user'])
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    // 点击频道
    handleClickChannel (item, index) {
      // 非编辑状态
      if (!this.isEdit) {
        this.channelChannel(item, index)
      } else { // 编辑状态
        index !== 0 && this.delChannel(item, index)
      }
    },
    // 进入频道
    channelChannel (item, index) {
      // 关闭模态框
      this.$emit('input', false)
      // 修改当前激活频道 -> 子传父
      this.$emit('update:active-index', index)
    },
    // 删除频道
    async delChannel (item, index) {
      // console.log('delChannel....')
      // 两种 本地和发送请求
      this.channels.splice(index, 1)
      this.$emit('delete-success')
      // 如果登录了
      if (this.user) {
        // 请求
        try {
          await delUserChannels(item.id)
        } catch (error) {
          console.dir(error)
        }
      } else {
        // 本地删除
        window.localStorage.setItem('channels', JSON.stringify(this.channels))
      }
    },
    // 添加频道
    async handleAddClick (item, index) {
      this.channels.push(item)

      if (this.user) {
        // 登录了,发请求加
        // id 排除第一个
        // seq 顺序序号:要求从2开始
        const channels = this.channels.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2
          }
        })
        const data = await resetChannels(channels)
        console.log(data)
      } else {
        // 没登录 本地加
        // this.channels.push(item)
        window.localStorage.setItem('channels', JSON.stringify(this.channels))
      }
    },
    // 获取全部频道
    async loadAllChannels () {
      const data = await getAllChannels()
      data.channels.forEach(item => {
        // zai渲染之前,添加几个布尔值,为了使每个频道之间独立,不享用同一个变量
        item.downPullLoading = false // 当前频道下拉状态
        item.upPullLoading = false // 当前频道上拉加载更多
        item.upPullFinished = false // 当前频道加载完毕
        // 添加历史时间戳
        item.timestamp = Date.now() // 默认时间戳,为每个频道添加时间戳
        item.articles = [] // 为了控制每个频道自己的文章列表数据
      })
      this.allChannels = data.channels
    }
  }
}
</script>

<style lang="less" scoped>
.channel {
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 12px;
    }
  }
  .channel-content {
    .text {
      font-size: 16px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 20px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
