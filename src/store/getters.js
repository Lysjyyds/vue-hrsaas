const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 封装token
  name: state => state.user.userInfo.username, // 封装用户的信息
  userId: state => state.user.userInfo.userId, // 用户的id
  avatar: state => state.user.userInfo.staffPhoto, // 建立用户头像的映射
  companyId: state => state.user.userInfo.companyId, // 建立公司的id
  routes: state => state.permission.routes
}
export default getters
