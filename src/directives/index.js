// 自定义指令
// 解决图片报错问题

export const imgError = {
  inserted(el, options) {
    // el:指令多绑定的元素，可以用来直接操作Dom
    // console.log(el)
    el.onerror = function() {
      // 如果图片赋值出错，给他一张默认图片
      // console.log(options)
      el.src = options.value
    }
  }
}
