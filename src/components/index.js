import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/UploadExcel'
import ImageUload from '@/components/ImageUpload'

export default {
  install(Vue) {
    Vue.component(PageTools.name, PageTools)
    Vue.component(UploadExcel.name, UploadExcel)
    Vue.component(ImageUload.name, ImageUload)
  }
}
