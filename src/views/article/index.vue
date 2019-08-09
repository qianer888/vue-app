<template>
  <div class="article">
    <!-- 导航 -->
    <van-nav-bar title="黑马头条" left-text="返回" left-arrow @click-left="$router.back()"></van-nav-bar>
    <div>
      <!-- 作者信息 -->
      <auth-info :article="article"></auth-info>
      <!-- 文章标题 -->
      <h2 class="article-title">{{article.title}}</h2>
      <!-- 文章内容 v-html="<p>我是文章内容</p>" -->
      <div class="article-content" v-html="article.content" >

      </div>
      <!-- 更多操作 -->
      <more-action></more-action>
       <!-- 评论列表 ①进行触发使用$emit ②将此组件进行封装 因为在回复组件中可以将它作为子组件使用-->
      <comment-list :source="article_id"></comment-list>
      <!-- 回复列表 进行绑定 -->
      <!-- 注意:该组件是使用的一个表单元素,需要使用v-model进行数据绑定,
      而isShow这个变量并不是通过父组件进行控制的,而是通过点击评论列表中的回复按钮进行显示
      => 而这两个组件是属于非父子通信,在pc端的时候有进行讲解过非父子传值是通过事件总线进行控制的
      => 事件总线:创建一个vue实例,将触发事件和绑定事件都在事件总线中进行 -->
      <reply-list :article_id="article_id"></reply-list>
      <!-- 发布评论 -->
      <add-comment :target="article_id"></add-comment>
    </div>
  </div>
</template>

<script>
import AuthInfo from './components/auth-info.vue'
import MoreAction from './components/more-action.vue'
import CommentList from './components/comment-list.vue'
import ReplyList from './components/reply-list.vue'
import AddComment from './components/add-comment.vue'
import { getArticleById } from '@/api/article.js'
import { mapState } from 'vuex'
export default {
  name: 'ArticleIndex',
  components: {
    AuthInfo,
    MoreAction,
    CommentList,
    ReplyList,
    AddComment
  },
  data () {
    return {
      article: {},
      isShow: true
    }
  },
  computed: {
    ...mapState(['user']),
    article_id () {
      return this.$route.params.article_id
    }
  },
  watch: {
    user () {
      this.loadArticle()
    },
    article_id () {
      this.loadArticle()
    }
  },
  created () {
    this.loadArticle()
  },
  methods: {
    async loadArticle () {
      const data = await getArticleById(this.article_id)
      console.log(data)
      this.article = data
    }
  }
}
</script>

<style lang="less" scoped>
.article {
  // padding: 20px;
  .article-title {
    font-size: 40px;
    font-weight: 400px;
  }
  .article-content {
    width: 100%;
    font-size: 20px;
  }
}
.add-comment {
  position: fixed;
  left: 0;
  bottom: 0;
}
</style>
