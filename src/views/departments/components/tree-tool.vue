<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%">
    <el-col>
      <span>{{ treeData.name }}</span>
    </el-col>
    <el-col :span="6">
      <el-row type="flex" justify="end">
        <el-col><span>{{ treeData.manager }}</span></el-col>
        <el-col>
          <el-dropdown @command="clcikItem">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    // 定义一个props属性
    treeData: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    async clcikItem(type) {
      if (type === 'add') {
        console.log('添加了')
      } else if (type === 'edit') {
        console.log('编辑了')
      } else {
        await this.$confirm('确定要退出吗？')
        await delDepartments(this.treeData.id)// 删除
        this.$message.success('bb,你做咩不嗨森')
        this.$emit('getDepartments') // 重新获取数据
      }
    }
  }
}
</script>

<style>

</style>
