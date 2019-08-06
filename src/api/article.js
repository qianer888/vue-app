// 当前激活的频道的文章列表api

/**
 * 文章数据
 */
// 导入request
import request from '@/utils/request.js'

// 获取文章列表
// 时间戳 Date.now()
export const getArticles = ({ channel_id, timestamp, with_top = 1 }) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id, timestamp, with_top
    }
  })
}

// 不喜欢文章
export const dislikes = (articleId) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}

// 举报文章
export const reportArticle = ({
  articleId,
  type = 0,
  remark = ''
}) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/reports',
    data: {
      target: articleId,
      type,
      remark: ''
    }
  })
}
