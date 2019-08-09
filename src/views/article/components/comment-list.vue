<template>
  <div>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="(item,index) in comments" :key="index">
        <div slot="icon">
          <img class="avatar" :src="item.aut_photo" alt="">
        </div>
        <div slot="title">
          <span>{{item.aut_name}}</span>
        </div>
        <div slot="default">
          <van-button icon="like-o" size="mini" plain>赞</van-button>
        </div>
        <div slot="label">
          <p>{{item.content}}</p>
          <p>
            <span>{{item.pubdate | relTime}}</span>
            ·
            <span @click="showReply(item)">回复</span>
          </p>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { getCommentsOrReply } from '@/api/article.js'
import vm from '@/utils/global-bus.js'
export default {
  name: 'CommentList',
  props: {
    // 文章id&评论id
    source: {
      type: [Number, String],
      // 必须传的
      required: true
    },
    // 评论=>true&回复=>false
    isComment: {
      type: Boolean
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      comments: [],
      offset: null // 并不知道它第一次的偏移量是多少
    }
  },
  created () {},
  computed: {
    article_id () {
      return this.$route.params.article_id
    }
  },
  methods: {
    // 展示回复组件
    showReply (item) {
      // 在这里触发回复组件并把楼主的评论传给回复组件
      vm.$emit('isShow', item)
    },
    async onLoad () {
      const data = await getCommentsOrReply({
        source: this.source, // 将此处改成可变的=> 评论id&回复id
        offset: this.offset,
        isComment: this.isComment })
      // console.log(data)
      if (data.results.length) {
        this.comments.push(...data.results)
        // 修改页码-> 偏移量
        this.offset = data.last_id
        // 可以自动变为true 但是没办法停止,需要手动更新
        this.loading = false
      } else {
        this.finished = true
        this.loading = false
      }

      // console.log('onLoad')
      // // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 5; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   // 加载状态结束
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 10) {
      //     this.finished = true
      //   }
      // }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  margin-right: 10px;
}
</style>
