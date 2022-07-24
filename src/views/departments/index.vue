<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <tree-tool :tree-data="company" :is-root="true" />
      </el-card>
      <el-tree default-expand-all :data="departs" :props="defaultProps">
        <template v-slot="{data}">
          <tree-tool :tree-data="data" :is-root="false" @getDepartments="getDepartments" />
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { getDepartments } from '@/api/departments'
import treeTool from './components/tree-tool.vue'
import { transListToTree } from '@/utils/index'
export default {
  components: { treeTool },
  data() {
    return {
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
      const res = await getDepartments()
      console.log(res)
      // 替换公司数据
      this.company = {
        name: res.companyName,
        manager: res.companyManagerc || '管理员'
      }
      this.departs = transListToTree(res.depts, '')
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

