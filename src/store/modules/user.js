// 状态
import { getToken, removeToken, setTimeStamp, setToken } from '@/utils/auth'
import { getUserDetailById, getUserInfo, login } from '@/api/user'
import { resetRouter } from '@/router'

const state = {
  token: getToken(), // 初始化到时候把本地存储到token复制给vue默认值
  userInfo: {} // 初始化一个对象用于存放用户数据
}
// 修改状态
const mutations = {
  // 修改用户状态
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },

  // 修改token的方法
  setToken(state, token) {
    state.token = token // vuex
    setToken(token)// cookie
  },
  removeToken(state, token) {
    state.token = null
    removeToken(token)
  },
  removeUserInfo(state, userInfo) {
    state.userInfo = {} // 清空用户的信息
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    const res = await login(data)
    // console.log(res)
    // 获取到的token存储到vuex
    context.commit('setToken', res)
    setTimeStamp()// 将当前最新时间写入缓存
  },
  // 登录请求 》》 commit 》》 mutations
  async getUserInfo(context) {
    const res = await getUserInfo()
    const baseInfo = await getUserDetailById(res.userId)// // 为了获取头像
    const baseResult = { ...res, ...baseInfo } // 将两个接口结果合并
    context.commit('setUserInfo', baseResult) // // 提交mutations
    return baseResult
  },
  // 退出功能
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    // 重置路由匹配信息
    resetRouter()

    // context是根节点的上下文
    // vuex里面的路由表置空
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

