<template>
  <div>
    <van-dialog :value="value" @input="$emit('input', $event)" :show-confirm-button="false">
      <van-cell-group>
        <van-cell title="从相册选择" @click="choseFile"/>
        <!-- 选择文件改变 @change 原生js -->
        <input style="display: none;" type="file" ref="input" @change="changeFile">
        <van-cell title="拍照" />
        <van-cell title="取消" @click="$emit('input', false)" />
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
// import Vue from 'vue' 在全局注册 为了在哪都能用 所以这个是不需要的
import { ImagePreview, Dialog } from 'vant' // ImagePreview图片预览是需要函数调用的而不是标签
// Vue.use(ImagePreview)
import { updateUser } from '@/api/user.js'
export default {
  name: 'UploadPhoto',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
    }
  },
  created () {
    console.log(this)
  },
  computed: {

  },

  methods: {
    // 打开磁盘
    choseFile () {
      // 打开磁盘 -> 通过 input type='file' 可以打开磁盘->
      //  是因为有个按钮一点就可以打开磁盘,而现在没有,需要操作dom元素->页面的交互进行操作dom->
      // 使用vue操作doms是ref标签
      // 获取原生dom,而file类型input是通过点击触发打开磁盘,所以添加点击实现即可触发
      this.$refs['input'].click()
    },
    // 文件发生改变(从无到有,从1到2)时,触发
    changeFile () {
      // 点击时获取的文件 原生input file中files[0]可以获取选中的文件信息
      const file = this.$refs['input'].files[0]
      // 预览=> 使用img 的src 可以传它的网络地址|| 改图片的base64格式编码(字符串)
      // 把接收到的file文件转换成src属性可以使用的base64为编码(原生方法)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      // 直接拿result是拿不到的,因为编译需要时间,reader中有个onload事件,可以使它处理完毕时,拿到数据
      reader.onload = () => {
        // console.log(reader.result) // 这里是base64格式编码
        ImagePreview({
          images: [reader.result],
          // startPosition: 1,
          showIndex: false,
          // 箭头函数的使用场景:所有使用匿名函数的位置最好改为箭头函数=> this指向window
          onClose: () => {
            // do something
            // 此时的this,指向的不是同一个this
            // console.log(this)
            this.openDia()
          }
        })
      }
      // console.log(file)
    },
    // 打开确认框
    openDia () {
      // console.log('----')
      // this.$toast()
      Dialog.confirm({
        title: '是否选择该图片为头像?'
      }).then(() => {
        // 发送请求上传图片
        this.updataUser()
        // on confirm
      }).catch(() => {
        // on cancel
      })
    },
    // 修改用户头像
    async updataUser () {
      const data = await updateUser('photo', this.$refs['input'].files[0])
      console.log(data)
      // data.photo在父组件的头像中更新
      if (data.photo) {
        this.$emit('upload-success', data.photo)
      }
      // 关闭外层对话框
      this.$emit('input', false)
    }
  }
}
</script>

<style>
</style>
