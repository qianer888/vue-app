// 频道api

/**
 * 获取频道列表数据
 * 如果headers设置了token 获取用户频道
 */
// 导入request
import request from '@/utils/request.js'

// 频道列表
export const getChannelsUserOrDefault = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/channels'
  })
}

// 获取全部列表
export const getAllChannels = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/channels'
  })
}

// 添加列表(设置用户频道列表增量式(乱序),应该使用批量修改用户频道列表(重置式))
/**
 * channels:[
 * {id:,seq:}
 * ]
 */
export const resetChannels = (channels) => {
  return request({
    method: 'put',
    url: '/app/v1_0/user/channels',
    data: {
      channels
    }
  })
}

// 删除方法
export const delUserChannels = (channelId) => {
  return request({
    method: 'delete',
    url: `/app/v1_0/user/channels/${channelId}`
  })
}
