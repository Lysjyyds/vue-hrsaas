<template>
  <el-tabs>
    <el-tab-pane label="个人登录设置">
      <el-card class="card">
        <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="120px">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="userInfo.username" style="width: 40%" />
          </el-form-item>
          <el-form-item label="密码" prop="password2">
            <el-input v-model="userInfo.password2" style="width: 40%" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateUserInfo">更新</el-button>
          </el-form-item>
        </el-form>

      </el-card>
    </el-tab-pane>
    <el-tab-pane label="配置管理">
      <component :is="UserInfo" />
    </el-tab-pane>
    <el-tab-pane label="岗位详情">
      <component :is="JobInfo" />
    </el-tab-pane>
  </el-tabs>
</template>
<script>

import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from '@/views/employees/components/user-info'
import JobInfo from '@/views/employees/components/job.info'

export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      JobInfo: 'JobInfo',
      UserInfo: 'UserInfo',
      userId: this.$route.params.id, // 这样可以后面直接通过 this.userId进行获取数据
      userInfo: {
        // 专门存放基本信息
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    async updateUserInfo() {
      try {
        // 校验
        await this.$refs.userForm.validate()
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 }) // 将新密码的值替换原密码的值
        this.$message.success('保存成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  margin: 20px
}
</style>
