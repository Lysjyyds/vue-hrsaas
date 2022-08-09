<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermisson('0',1)">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <el-button v-if="row.type===1" type="text" @click="addPermisson(row.id,2)">添加</el-button>
            <el-button type="text" @click="edit(row.id)">编辑</el-button>
            <el-button type="text" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <!-- 放置一个弹层 用来编辑新增节点 -->
      <el-dialog :title="`${showText}权限点`" :visible="isShow" @close="close">
        <!-- 表单 -->
        <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width:90%" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
            <el-button size="small" @click="close">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import { addPermission, delPermission, getPermissionDetail, getPermissionList, updatePermission } from '@/api/permisson'
import { transListToTree } from '@/utils'

export default {
  name: 'Permiss',
  data() {
    return {
      // 需要展示的数据
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      isShow: false
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async edit(id) {
      const res = await getPermissionDetail(id)
      // console.log(res)
      this.formData = res
      this.isShow = true
    },
    addPermisson(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.isShow = true
    },
    close() {
      this.$refs.perForm.resetFields()
      this.isShow = false
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
    },
    async btnOK() {
      await this.$refs.perForm.validate()
      try {
        if (this.formData.id) {
          await updatePermission(this.formData)
          // 编辑
        } else {
          // 添加
          await addPermission(this.formData)
        }
        this.$message.success(`${this.showText}成功`)
        this.close()
        await this.getPermissionList()
      } catch (e) {
        this.$message.success('添加失败')
      }
    },
    async del(id) {
      await this.$confirm('确认删除？')
      await delPermission(id)
      this.$message.success('删除成功')
      await this.getPermissionList()
    },
    async getPermissionList() {
      const res = await getPermissionList()
      console.log(res)

      this.list = transListToTree(res, '0')
      console.log(this.list)
    }
  }
}
</script>

<style>

</style>
