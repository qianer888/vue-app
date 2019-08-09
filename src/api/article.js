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

// 文章详情
export const getArticleById = article_id => {
  return request({
    method: 'get',
    url: `/app/v1_0/articles/${article_id}`
  })
}

// 文章评论
/**
 * type是a或c评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
 * source是源id，文章id或评论id
 * 相当于page,时间戳 offset否获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
 * 相当于per_page limit否获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
 *
 *
 * 分页:
 * page per_page total
 *
 */
export const getCommentsOrReply = ({
  isComment = true,
  source,
  offset = null
  // limit
}) => {
  return request({
    method: 'get',
    url: `/app/v1_0/comments`,
    params: {
      type: isComment ? 'a' : 'c',
      source,
      offset

    }
  })
}

// 添加评论或添加回复
/**
 * targetinteger必须评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
  contentstring必须评论内容
  art_idinteger非必须文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
 */
export const addCommentsOrReply = ({
  target,
  content,
  art_id = null
}) => {
  return request({
    method: 'POST',
    url: `/app/v1_0/comments`,
    data: {
      target,
      content,
      art_id

    }
  })
}
