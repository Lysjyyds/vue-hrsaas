<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() { // 测试
    this.$store.dispatch('user/getUserInfo')
  }
}

</script>
