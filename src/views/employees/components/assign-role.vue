<template>
  <el-dialog :visible="isShow" title="分配角色" @close="close()">
    <!-- 分配角色 -->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{
          item.name
        }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="12">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  name: 'AssiignRole',
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    currentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      roleIds: [],
      list: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async btnOk() {
      try {
        await assignRoles({
          id: this.currentId,
          roleIds: this.roleIds
        })
        this.$message.success('更改成功')
        this.close()
      } catch (e) {
        this.$message.success('更改失败')
        this.close()
      }
    },
    close() {
      this.roleIds = []
      this.$emit('update:isShow', false)
    },
    async getRoleList() {
      const { rows } = await getRoleList()
      this.list = rows
      // this.roleIds = roleIds
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds // 赋值本用户的角色
    }
  }
}
</script>
