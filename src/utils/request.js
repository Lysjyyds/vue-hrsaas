import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 600000// 定义超时时间 单位s
import router from '@/router'

const request = axios.create({
  // baseURL
  baseURL: process.env.VUE_APP_BASE_API
})

// 请求拦截器
request.interceptors.request.use(config => {
  const token = store.getters.token
  if (token) {
    if (IsCheckTimeOut()) {
      // 如果它为true表示 过期了
      // token没用了 因为超时了
      store.dispatch('user/logout') // 登出操作
      // 跳转到登录页
      router.push('/login')
      Message.error('token超时了')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error))

// 响应拦截器
request.interceptors.response.use(response => {
  console.log(response)
  const { data: { success, data, message }} = response // 结构
  if (success) {
    return data // seccess为true 就返回token
  }
  Message.error(message || '系统错误') // 错误就提示
  // 失败到promise 》》 借口请求的地方报错呢
  return Promise.reject(message || '系统错误')
}, error => {
  if (error.response.status === 401) {
    // 退出登录
    store.dispatch('user/logout')
    router.push('/login')
  }
  Message.error(error.response?.data?.message || '系统错误')
  return Promise.reject(error)
})

function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) > TimeOut
}

export default request // 默认导出request请求
