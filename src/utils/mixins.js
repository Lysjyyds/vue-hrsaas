import store from '@/store'

export const mixins = {
  method: {
    checkPermissios(key) {
      console.log(store.state.user.userInfo.roles.points)
      return store.state.user.userInfo.roles.points
    }
  }
}
