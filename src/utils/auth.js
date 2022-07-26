import Cookies from 'js-cookie'
const timeKey = 'hrsaas-timestamp-key' // 设置一个独一无二的key
// cookie
// 怎么操作cookie
// 借助第三方库
const TokenKey = 'hrsass_token' // token存储到本地存储 》》 key

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}

// 设置时间戳
export function setTimeStamp() {
  Cookies.set(timeKey, Date.now())
}
