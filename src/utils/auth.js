// 用来封装token的本地存储,方便之后调用

const USER_KEY = 'user'

// 存储token 需要本地化存储 localStorge 和 sessionStorage 都可以

// 获取
export const getUser = () => { JSON.parse(window.localStorage.getItem(USER_KEY)) }

// 设置 注意第二个参数 需要字符串格式数据
export const setUser = data => { window.localStorage.setItem(USER_KEY, JSON.stringify(data)) }

export const removeUser = () => { window.localStorage.removeItem(USER_KEY) }
