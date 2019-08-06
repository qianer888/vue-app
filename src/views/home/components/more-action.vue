<template>
<!-- 弹出层:模态框 -> 底部大弹框
     弹出框:空间中弹出消息 ① js方法 ② 标签方法 -->
     <!-- 这里要注意v-model中值 -> 表单元素 双向绑定  show来源于上一级-->
    <!-- v-model的语法糖 :value="" @input="" ->v-model="show" -->
  <van-dialog :value="value" @input="$emit('input')" :close-on-click-overlay="true" :show-cancel-button="false" :show-confirm-button="false">
    <van-cell-group v-if="!isReportShow">
      <!-- 不感兴趣: -->
      <van-cell icon="location-o" title="不感兴趣" @click="handledislikeArticle()" />
      <van-cell icon="location-o" title="反馈垃圾内容" is-link @click="isReportShow=true"/>
      <van-cell icon="location-o" title="拉黑作者" />
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReportShow=false" />
      <van-cell v-for="item in reportsType" :key="item.type" :title="item.title" icon="location-o"  @click="handleReportArticle(item)"/>
    </van-cell-group>
  </van-dialog>
</template>

<script>
import { dislikes, reportArticle } from '@/api/article.js'
export default {
  name: 'MoreAction',
  data () {
    return {
      isReportShow: false,
      reportsType: [
        { title: '其他问题', type: 0 },
        { title: '标题夸张', type: 1 },
        { title: '低俗色情', type: 2 },
        { title: '错别字多', type: 3 },
        { title: '旧闻重复', type: 4 },
        { title: '广告软文', type: 5 },
        { title: '内容不实', type: 6 },
        { title: '涉嫌违法犯罪', type: 7 },
        { title: '侵权', type: 8 }
      ]
    }
  },
  // 组件的显示和隐藏是父组件传过来的,所以要用props
  //   props: ['show']
  // [数据的几种情况]
  // 自己用-> data
  // 接收别人传过来的数据 -> props
  // 自己用,别人也要用 -> vuex
  // props:['show']
  // props可以给出对象类型 可以控制变量的类型和默认值
  props: {
    value: {
      type: Boolean, // 类型是布尔值,类型有几种类型: String Number Boolean Array Object Date Function Symbol
      default: false // 默认是false
    },
    currentArticle: {
      type: Object,
      // 如果default的值是非基本类型,此时数据默认值应该是作为函数的返回值
      default: () => {}
    }
  },
  methods: {
    // 举报
    async handleReportArticle (item) {
      // console.log('我进来了')
      const { art_id: articleId } = this.currentArticle
      // console.log(item.type)
      try {
        await reportArticle({ articleId, type: item.type })
        // 移除文章-> 父组件去操作
        this.$emit('dislike-success')
        // 关闭对话框
        this.$emit('input', false)
        // 提示成功
        this.$toast('举报成功')
      } catch (error) {
        console.dir(error)
        if (error.response.status === 409) {
          this.$toast('已被举报')
        } else {
          this.$toast('举报失败')
        }
      }
    },
    // 不感兴趣
    async handledislikeArticle () {
      // console.log(this.currentArticle)
      const { art_id: articleId } = this.currentArticle
      try {
        // 想要一个文章ID-> 看看组件中有没有可用的ID-> data和props中都没有-> 来源于外部组件
        await dislikes(articleId)
        // 移除文章-> 父组件去操作
        this.$emit('dislike-success')
        // 关闭对话框
        this.$emit('input', false)
        // 提示成功
        this.$toast('操作成功')
      } catch (error) {
        console.dir(error)
      }
    }
  }
}
</script>

<style scoped lang='less'></style>
