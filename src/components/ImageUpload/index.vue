<template>
  <div>
    <el-upload
      action="/"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :class="{completed:isCompleted}"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云的包
// 需要实例化
const cos = new COS({
  SecretId: 'AKIDmcGfpCYjjgdOuBG8l9SYP1NTJxNYUBfv',
  SecretKey: '82hBUbWDi0DC3f4GEziT3OTN5aqtkRyH'
})
// 实例化的包 已经具有了上传的能力 可以上传到该账号里面的存储桶了
export default {

  name: 'ImageUload',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [
        {
          url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F22%2F20210722063020_3b7a9.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662274712&t=be5f3f396f880eb3f178063a328c2642'
        }
      ]
    }
  },
  computed: {
    isCompleted() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 删除
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    // 添加
    changeFile(file, fileList) {
      this.fileList = fileList
    },
    // 上传文件限制
    beforeUpload(file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024 // 1M=1024KB 1KB = 1024B
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
    },
    // 进行上传操作
    upload({ file }) {
      //   console.log(params.file)
      // 执行上传操作
      cos.putObject({
        Bucket: 'laoyishujia-1313213430', // 存储桶
        Region: 'ap-nanjing', // 地域
        Key: file.name, // 文件名
        Body: file, // 要上传的文件对象
        StorageClass: 'STANDARD' // 上传的模式类型 直接默认 标准模式即可
        // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
      }, function(err, data) {
        // data返回数据之后 应该如何处理
        console.log(err || data)
      })
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
.completed {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>
