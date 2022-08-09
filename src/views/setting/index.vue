<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="isShow = true"
              >新增角色
              </el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column label="序号" width="120" type="index" />
              <el-table-column label="角色名称" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template slot-scope="{row}">
                  <el-button size="small" type="success" @click="fenpei(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="edit(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="del(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                layout="prev,pager,next"
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="total"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>

      <el-dialog :visible="isShow" :title="isAdd" @close="close">
        <el-form ref="role" label-width="120px" :model="roleFormDate" :rules="rules">
          <el-form-item label="角色" prop="name">
            <el-input v-model="roleFormDate.name">1</el-input>
          </el-form-item>
          <el-form-item prop="direction" label="描述">
            <el-input v-model="roleFormDate.description">1</el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="btnOk">确认</el-button>
        </template>
      </el-dialog>
    </div>
    <!--    弹层-->
    <el-dialog

      :visible="isShow1"

      @close="close1"
    >
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <template #footer>
        <el-button size="mini" @click="close1">取消</el-button>
        <el-button size="mini" type="primary" @click="btnPermission">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { addRole, assignPerm, deleteRole, getCompanyInfo, getRoleDetail, getRoleList, updateRole } from '@/api/setting'
import { transListToTree } from '@/utils'
import { getPermissionList } from '@/api/permisson'

export default {
  defaultProps: {
    label: 'name'
  },
  data() {
    return {
      isShow1: false,
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null, // 用来记录分配角色的id
      roleFormDate: {
        name: '',
        description: ''
      },
      defaultProps: {
        label: 'name'
      },
      rules: {
        username: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      activeName: 'second',
      list: [],
      formData: '',
      total: 0, // 记录总数
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 2
      },
      isShow: false
    }
  },
  computed: {
    isAdd() {
      return this.roleFormDate.id ? '编辑角色' : '新增角色'
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo() // 获取公司列表
  },
  methods: {
    async btnPermission() {
      const selectCheck = this.$refs.permTree.getCheckedKeys()
      // console.log(selectCheck)
      await assignPerm({
        id: this.roleId, // 获取大当前点击的角色id
        permIds: selectCheck // 修改之后的权限列表
      })
      this.$message.success('分配权限成功')
      this.close1()
    },
    async fenpei(id) {
      this.permData = transListToTree(await getPermissionList(), '0') // 转化list到树形数据
      this.roleId = id
      // 应该去获取 这个id的 权限点
      // 有id 就可以 id应该先记录下来
      const { permIds } = await getRoleDetail(id) // permIds是当前角色所拥有的权限点数据
      this.selectCheck = permIds // 将当前角色所拥有的权限id赋值
      this.isShow1 = true
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    async getRoleList() { // 获取列表数据
      const { rows, total } = await getRoleList(this.page)
      this.list = rows
      this.total = total
    },
    changePage(page) {
      // 切换之后的最新页数
      this.page.page = page
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
      // console.log(res)
    },
    // 删除
    async del(id) {
      await this.$confirm('确认删除该角色吗')
      const len = this.list.length
      await getRoleList()
      await deleteRole(id)
      if (len === 1 && this.page.page > 1) { // 当前页数不是第一页的情况下
        this.page.page--
      }
      this.$message.success('删除角色成功')
    },
    // 编辑
    async edit(id) {
      this.isShow = true
      this.roleFormDate = await getRoleDetail(id)
    },
    async btnOk() {
      try {
        await this.$refs.role.validate()
        if (this.roleFormDate.id) {
          await updateRole(this.roleFormDate)
        } else {
          // 新增业务
          await addRole(this.roleFormDate)
        }
        this.getRoleList() // 重新拉去数据
        this.$message.success('操作成功')
        this.isShow = false
      } catch (error) {
        console.log(error)
      }
    },
    close() {
      this.isShow = false
      this.roleFormDate = {
        name: '',
        description: ''
      }
    },
    close1() {
      this.isShow1 = false
      // 数组里面选中对节点置空
      this.selectCheck = []
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px
}
</style>
