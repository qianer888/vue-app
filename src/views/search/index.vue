<template>
  <div class='search-container'>
      <!-- 搜索框 -->
    <van-search
    v-model="searchText"
    placeholder="请输入搜索关键词"
    show-action
    @search="onSearch(searchText)"
    @cancel="onCancel"
    />
    <!-- 搜索列表-联想 -->
    <!--  -->
    <van-cell-group v-if="searchText.length!==0 && suggestData.length!==0">
        <van-cell v-for="(item,index) in suggestData.options" :key="index" icon="search" @click="onSearch(item)">
            <div slot="title" v-html="highlightCell(item,searchText)">

            </div>
        </van-cell>
    </van-cell-group>
    <!-- 搜索列表-历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <van-icon @click="isDeleteData=true" v-show="!isDeleteData" slot="right-icon" name="delete" style="line-height:inherit"></van-icon>
        <div v-show="isDeleteData">
          <span style="margin-right:10px" @click="delHistories">全部删除</span>
          <span @click="isDeleteData=false">完成</span>
        </div>
      </van-cell>
      <van-cell :title="item" v-for="(item,index) in searchHistories" :key="index">
        <van-icon v-show="isDeleteData" slot="right-icon" name="close" style="line-height:inherit"></van-icon>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { getSuggestion } from '@/api/search.js'
import { debounce } from '@/utils/debounce.js'
export default {
  name: 'searchIndex',
  data () {
    return {
      searchText: '',
      // 联想建议数据
      suggestData: [],
      isDeleteData: false,
      // 搜索历史记录-> 如果有本地数据->直接使用,反之加上
      searchHistories: JSON.parse(window.localStorage.getItem('search-histories')) || []
    }
  },
  // 总结得来的结论:所有this.出来的属性都可以监听
  watch: {
    // 使用防抖函数
    /**
     * 1. 需要防抖的函数 a:function(){}
     * 2. 防抖函数: debounce(a,800)
     * 3. 得到返回的数据 b = debounce(a,800) b()
     */
    searchText: debounce(async function () {
      if (!this.searchText.trim().length) {
        this.suggestData = []
        return
      }
      try {
        // 拿数据
        const suggestData = await getSuggestion(this.searchText)
        this.suggestData = suggestData
      } catch (error) {
        console.dir(error)
      }
    }, 800)

  },
  methods: {
    delHistories () {
      this.searchHistories = []
      window.localStorage.removeItem('search-histories')
    },
    // 高亮
    highlightCell (item, keywords) {
      return item.toLowerCase().split(keywords).join(`<span style="color:red">${keywords}</span>`)
    },
    // 点击回车后触发
    onSearch (queryText) {
      if (!queryText.trim().length) {
        return
      }
      // [去重]
      // es6 Set是构造函数
      // Set的实参可以是数组
      // Set是容器 -> 里面保存的都是非重复元素
      // Set的实例方法->aaa.add()去重后添加
      // 把Set转换为数组
      // 数组有一个方法可以吧容器转换为数组 Arry.from(容器)

      const aaa = new Set(this.searchHistories)
      aaa.add(queryText)
      this.searchHistories = Array.from(aaa)
      // [历史记录]向本地添加数据
      // this.searchHistories.push(queryText)
      window.localStorage.setItem('search-histories', JSON.stringify(this.searchHistories))

      // [切换到查询结果] 1. 点击回车后获取当前搜索列表
      console.log('onSearch----' + queryText)
      // 把关键字或者词条文字传递掉搜索结果组件
      this.$router.push({
        name: 'search-result',
        params: {
          q: queryText
        }
      })
      // 2. 点击每条获取当前点名称
    },
    // 点击取消后触发
    onCancel () {
      // console.log('onCancel----')
      this.$router.back()
    }
  }
}
// [搜索列表高亮]
// "fafdgafdgadafagfdgadf".split("ga") → 以ga分割转为数组
// "fafdgafdgadafagfdgadf".split("ga").join("<span>ga</span>") →再转为字符串

// [防抖函数]
// 问题:短时间内频繁发送请求-> 短时间内多处触发同一个事件-> 性能很差
// 类比:tab切换 短时间内容频繁切换
// 类比:鼠标滚轮滚动-> 频繁获取卷曲距离
// 解决方案:1. 防抖函数
//         2. 主流的js库 -> loadash.js
</script>

<style scoped lang='less'></style>
