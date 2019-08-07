// 防抖函数

/**
 *
 * @param {函数} func
 * @param {时间} wait
 */
export const debounce = function (func, wait) {
  let timeout
  return function () {
    let context = this
    let args = arguments

    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}
