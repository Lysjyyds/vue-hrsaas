// 权限管理
import router from './router'
import store from './store'

import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const loginPath = '/login'
const notFoundPath = '/404'

const whiteList = [loginPath, notFoundPath]

// 监听路由变化
// 所有路由跳转之前触发
// to >> 目标路由
// from >> 当前路由
// next >> 调用形式决定了最终去哪个路由
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  // 1.是否哟呀token
  const token = store.getters.token

  if (token) {
    // 判断是否去登录页
    if (!store.getters.userId) { // 如果用户登录了没有用户信息获取一下
      const res = await store.dispatch('user/getUserInfo')
      console.log(res)
      const routes = await store.dispatch('permission/filterRoutes', res.roles.menus)
      // 默认情况只有静态路由
      // 进行动态路由的添加
      console.log(routes)
      router.addRoutes([...routes, {
        path: '*', redirect: '/404', hidden: true
      }]
      )
      next(to.path)
    }
    if (to.path === loginPath) {
      next('/') // 跳转到首页
    } else {
      next() // 直接放行
    }
  } else {
    if (whiteList.includes(to.path)) { // 判断是否去百色名单页面 /login
      next()
    } else {
      next(loginPath) // 如果没有token，同时要去的页面不是白色名单页面，直接跳转到登录页面
    }
  }
})

// 后置守卫
router.afterEach(function() {
  NProgress.done() // 关闭进度条
})
