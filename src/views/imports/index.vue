<template>
  <Upload :on-success="onSuccess" />
</template>

<script>
import Upload from '@/components/UploadExcel'
import { importEmployee } from '@/api/employees'
export default {
  components: {
    Upload
  },
  methods: {
    async  onSuccess({ header, results }) {
      // 如果是导入员工
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const resArr = results.map(item => {
        const obj = {}
        for (const itemKey in item) {
          if (['timeOfEntry', 'correctionTime'].includes(userRelations[itemKey])
          // 值是时间 >> 格式化
          ) { obj[userRelations[itemKey]] = new Date(this.formatDate(item[itemKey], '/')) } else {
            obj[userRelations[itemKey]] = item[itemKey]
          }
        }
        return obj
      })
      await importEmployee(resArr) // 调用导入接口
      this.$message.success('上传成功')
      this.$router.back()
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
  // excel中的时间是一个数字，需要调用此方法进行处理 -> 直接复制

}
</script>

<style>

</style>
