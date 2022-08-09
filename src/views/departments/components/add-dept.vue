<template>
  <el-dialog :title="showTime" :visible="isShowAddDept" label-width="200px" @close="close">
    <el-form ref="form" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" placeholder="1-50个字符" />
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="formData.code" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <!-- <el-input v-model="formData.manager" placeholder="请选择" /> -->
          <el-select v-model="formData.manager" placeholder="请选择" @focus="getEmployeeSimple">
            <el-option
              v-for="item in options"
              :key="item.value"

              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="formData.introduce" placeholder="1-300个字符" />
        </el-form-item>
      </el-form-item></el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button type="primary" size="small" @click="sumbit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {

  name: 'AddDept',
  props: {
    // 是否显示
    isShowAddDept: {
      type: Boolean,
      default: false
    },
    // 当前操作的节点
    currentNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const checkNameRepeat = async(rule, value, callback) => {
      // 获取所有部门的数据
      const { depts } = await getDepartments()
      let currentChildren = null
      if (this.formData.id) {
        // 编辑

        // 当前兄弟节点的id
        currentChildren = depts.filter(item => item.pid === this.currentNode.pid && item.id !== this.currentNode.id)
      } else {
        currentChildren = depts.filter(item => {
          // 当前点击节点的子节点
          return item.pid === this.currentNode.id
        })
      }

      const isRepeat = currentChildren.some(item => item.name === value)
      if (isRepeat) {
        return Promise.reject('部门名称重复了')
      }
    }

    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      //  2、直接判断当前用户添写的code是否包含在已存在的数据里面
      let isRepeat
      if (this.formData.id) {
        // --> 新增的编辑判断逻辑：编辑的时候，需要把自己过滤掉再进行判断
        isRepeat = depts.some(item => item.code === value && item.id !== this.currentNode.id)
      } else {
        isRepeat = depts.some(item => (item.code === value))
      }
      if (isRepeat) {
        return Promise.reject('部门编码重复')
      }
      // --> 核心逻辑：用户输入的部门code跟任何部门的code都不能重复
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      options: [],
      value: '',
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur',
            validator: checkNameRepeat } // 自定义函数的形式校验
        ],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: checkCodeRepeat
          }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      }
    }
  },
  computed: {
    showTime() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.options = await getEmployeeSimple()
    },
    // 获取部门详情  add-dept.vue组件内部
    async  getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    },
    async sumbit() {
      await this.$refs.form.validate()
      if (this.formData.id) {
        await updateDepartments(this.formData)
        // 如果id存在 编辑功能
      } else {
        await addDepartments({
          ...this.formData, // 把表单数据展开
          pid: this.currentNode.id
        })
      }

      this.$message.success(`${this.showTime}成功`)
      // 重新拉取数据
      this.$emit('getDepartments')
      this.close()
    },
    close() {
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 表单数据需要重置
      this.$refs.form.resetFields()
      // 通过。sync属性出发父组件的
      this.$emit('update:isShowAddDept', false)
    }
  }
}
</script>

<style>

</style>
