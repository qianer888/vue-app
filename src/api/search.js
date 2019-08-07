// 搜索api
import request from '@/utils/request.js'

// 获取联想建议列表
export const getSuggestion = (q) => {
  return request({
    method: 'get',
    url: '/app/v1_0/suggestion',
    // 必须为对象
    params: {
      q
    }
  })
}

// 获取搜索结果
export const getSearchResult = ({ page, per_page, q }) => {
  return request({
    method: 'get',
    url: `/app/v1_0/search`,
    params: {
      page,
      per_page,
      q
    }
  })
}

// 获取历史记录

// export const getSearchHistories = ({ page, per_page, q }) => {
//   return request({
//     method: 'get',
//     url: `/app/v1_0/search/histories`,
//     params: {
//       page,
//       per_page,
//       q
//     }
//   })
// }
