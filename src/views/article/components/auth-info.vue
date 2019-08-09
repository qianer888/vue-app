<template>
  <div class="auth-info">
    <div class="base-info">
      <img class="avatar" :src="article.aut_photo" alt="">
      <div>
        <p>{{article.aut_name}}</p>
        <p>{{article.pubdate | relTime}}</p>
      </div>
    </div>
    <div>
      <van-button @click="handleFollow" class="star" :type="!article.is_followed?'danger':'primary'" :loading="loading" size="small" >{{article.is_followed?'已关注':'关注'}}</van-button>
    </div>
  </div>
</template>

<script>
import { starUser, unstarUser } from '@/api/user.js'
import { mapState } from 'vuex'
export default {
  name: 'AuthInfo',
  //  父传子
  props: { article: {
    type: Object,
    default: () => {}
  }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 关注与取消关注
    async handleFollow () {
      this.loading = true
      if (!this.user) {
        this.$toast('请登录')
        return
      } else {
        if (this.article.is_followed) {
        // 取消
          await unstarUser(this.article.aut_id)
          this.article.is_followed = false
        } else {
        // 关注
          await starUser(this.article.aut_id)
          this.article.is_followed = true
        }
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.auth-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26px;
  .base-info {
    display: flex;
    align-items: center;
    margin-left: 30px;
  }
  .avatar {
    margin-right: 10px;
    width: 100px;
    height: 100px;
    border-radius: 100%;
  }
  .star {
      margin-right: 30px;
  }
}
</style>
