<template>
  <div class="add-comment">
      <!-- 输入框 -->
    <div class="input-wrap">
      <input type="text" v-model="content">
    </div>
    <!-- 发布按钮 -->
    <div class="more-wrap">
      <!-- <van-icon v-if="!articleId" :name="article.is_collected ? 'star' : 'star-o'" @click="handleCollect"></van-icon> -->
      <van-button size="small" :disabled="!content.length" @click="handleAdd">发布</van-button>
    </div>
  </div>
</template>

<script>
import { addCommentsOrReply } from '@/api/article.js'
export default {
  name: 'AddComment',
  data () {
    return {
      content: ''
    }
  },
  props: {
    target: {
      type: [Number, String],
      // 必须传的
      required: true
    },
    art_id: {
      type: [Number, String]
    }
  },
  methods: {
    async handleAdd () {
      // 发送请求
      const data = await addCommentsOrReply({
        target: this.target, // 属性数据
        content: this.content,
        art_id: this.art_id // 属性数据
      })
      console.log(data)
    }
  }
}
</script>

<style lang="less" scoped>
.add-comment {
  width: 100%;
  background: #fff;
  padding: 20px;
  border-top: 2px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .input-wrap {
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 10px;
    height: 35px;
    display: flex;
    align-items: center;
    width: 100%;
    input {
      border: none;
      color: #999;
      font-size: 30px;
    }
  }
  .more-wrap {
    display: flex;
    width: 40%;
    align-items: center;
    justify-content: space-evenly;
  }
}
</style>
