<template>

  <van-popup v-model="isShow" position="bottom" :style="{height:'75%'}">
      <!-- 楼主 -->
      <van-cell>
        <div slot="icon">
          <img class="avatar" :src="commentTop.aut_photo" alt="">
        </div>
        <div slot="title">
          <span>{{commentTop.aut_name}}</span>
          &nbsp;
          <van-tag>楼主</van-tag>
        </div>
        <div slot="default">
          <van-button icon="like-o" size="mini" plain>赞</van-button>
        </div>
        <div slot="label">
          <p>{{commentTop.content}}</p>
          <p>
            <span>{{commentTop.pubdate | relTime}}</span>
          </p>
        </div>
      </van-cell>
      <!-- <hr> -->
      <!-- 对于楼主的评论 => 和comment-list中的结构相同,只有数据不同,因此封装这个列表 -->
      <comment-list :source="commentTop.com_id.toString()" :isComment="false" class="reply-list"></comment-list>
      <add-comment class="add-comment" :target="commentTop.com_id.toString()" :art_id="article_id"></add-comment>
  </van-popup>
</template>

<script>
import vm from '@/utils/global-bus.js'
import CommentList from './comment-list.vue'
import AddComment from './add-comment.vue'
export default {
  name: 'ReplyList',
  components: {
    CommentList,
    AddComment
  },
  props: {
    article_id: {
      type: [Number, String]
    }
  },
  data () {
    return {
      isShow: false,
      // 楼主数据
      commentTop: {
        com_id: ''
      }
    }
  },
  // 在另一个组件调用方法时,此方法的声明的数据要准备好=> created钩子函数的使用场景:为数据做准备工作 || 获取首屏数据
  created () {
    // 绑定
    vm.$on('isShow', (commentTop) => {
    //   console.log('--------')
      this.isShow = true
      this.commentTop = commentTop
    })
  }
}
</script>

<style lang='less' scoped>
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  margin-right: 10px;
}
.reply-list {
  margin-left: 40px;
}
.add-comment {
  position: fixed;
  left: 0;
  bottom: 0;
}
</style>
