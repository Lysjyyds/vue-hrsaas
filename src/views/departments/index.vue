<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <tree-tool :tree-data="company" :is-root="true" />
      </el-card>
      <el-tree default-expand-all :data="departs" :props="defaultProps">
        <template v-slot="{data}">
          <tree-tool :tree-data="data" :is-root="false" @getDepartments="getDepartments" @handleAddDepts="handleAddDepts" @handleEditDepts="handleEditDepts" />
        </template>
      </el-tree>
    </div>
    <add-dept ref="addDept" :is-show-add-dept.sync="isShowAddDept" :current-node="currentNode" @getDepartments="getDepartments" />
  </div>
</template>

<script>
import { getDepartments } from '@/api/departments'
import treeTool from './components/tree-tool.vue'
import { transListToTree } from '@/utils/index'
import AddDept from './components/add-dept.vue'
export default {
  components: { treeTool, AddDept },
  data() {
    return {
      loading: false,
      currentNode: {},
      isShowAddDept: false,
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' }, // 头部组件传值
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      try {
        const res = await getDepartments()
        console.log(res)
        // 替换公司数据
        this.company = {
          name: res.companyName,
          manager: res.companyManagerc || '管理员',
          id: ''
        }
        this.departs = transListToTree(res.depts, '')
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    handleAddDepts(node) {
      // 弹层展示出来
      this.isShowAddDept = true
      this.currentNode = node
    },
    handleEditDepts(node) {
      // 弹层展示出来
      this.isShowAddDept = true
      // 获取节点
      this.currentNode = node
      // 父组件 调用子组件的方法
      this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>

