<template>
  <Layer :layer="layer" @confirm="submitUpload" ref="layerDom">
    <el-upload
      ref="upload"
      class="upload-demo"
      drag
      multiple
      :action="uploadUrl"
      :limit="50"
      :on-change="handleChange"
      :on-exceed="handleExceed"
      :on-progress="handleProgress"
      :auto-upload="false"
      :on-success="handleSuccess"
      :on-error="handleError"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        拖拽文件到此 或 <em>点击上传</em>
      </div>
      <template #tip>
        <div v-if="isExceed" class="el-upload__tip text-red" style="color: red">
          仅能上传1个文件
        </div>
      </template>
    </el-upload>
  </Layer>
</template>

<script lang="ts">
import type { LayerType } from '@/components/layer/index.vue'
import type { Ref } from 'vue'
import type { ElFormItemContext } from 'element-plus/lib/el-form/src/token'
import { defineComponent, ref, computed, reactive  } from 'vue'
import { add, update } from '@/api/table'
import { selectData, radioData } from './enum'
import Layer from '@/components/layer/index.vue'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { database } from '@/store/data'

const baseURL: any = import.meta.env.VITE_BASE_URL

const SCALE_ENUM = ['大型', '中型', '小型']
const tableData = database.companyData.list

const dialogVisible = ref(false)

export default defineComponent({
  components: {
    Layer
  },
  
  props: {
    layer: {
      type: Object,
      default: () => {
        return {
          show: false,
          title: '',
          showButton: true
        }
      }
    }
  },

  setup(props, ctx) {
    const ruleForm: Ref<ElFormItemContext|null> = ref(null)
    const layerDom: Ref<LayerType|null> = ref(null)
    let form = ref({
      // 基础信息
      name: '',
      location: '',
      industry: '',
      scale: '',
      // 需求
      space: '',
      industry_service: '',
      life_and_infrastructure: '',
      talents: '',
      others: '',
      source: '',
    });

    const rules = {
      name: [{ required: true, message: '请输入企业或园区名称', trigger: 'blur' }],
    }

    init()
    function init() { // 用于判断新增还是编辑功能
      if (props.layer.row) {
        form.value = JSON.parse(JSON.stringify(props.layer.row)) // 数量量少的直接使用这个转
      } else {

      }
    }
    const upload = ref<UploadInstance>()
    const uploadUrl = baseURL + '/uploadOneFile'
    const fileList = ref([])
    let resData = reactive({
      name: '',
      location: '',
      industry: '',
      scale: ''
    }) // 用于接收上传成功后的数据

    const handleChange = (files) => {
      console.log('handleChange');
      // console.log(files);
    }

    const loading = ref(false)
    const handleProgress = (evt) => {
      loading.value = true
      console.log("handleProgress", evt)
    }

    const submitUpload = () => {
      upload.value!.submit()
    }

    const showCapital = ref(false);
    const capital = ref(0)

    const handleSuccess = (response, file, fileList) => {
      console.log('文件上传成功', response);
      resData.name = response['name']
      resData.location = response['location']
      resData.industry = response['industry']
      resData.scale = response['scale']

      
      loading.value = false
      dialogVisible.value = true
    }

    const handleError = (err, file, fileList) => {
      console.error('文件上传失败', err);
      loading.value = false
      // 处理上传失败的错误
    };


    const isExceed = ref(false)
    const handleExceed: UploadProps['onExceed'] = (files) => {
      isExceed.value = true
      upload.value!.clearFiles()
      const file = files[0] as UploadRawFile
      // file.uid = genFileId()
      upload.value!.handleStart(file)
    }

    return {
      SCALE_ENUM,
      form,
      rules,
      layerDom,
      selectData,
      radioData,

      resData,
      dialogVisible,
      tableData,
      upload,
      uploadUrl,
      fileList,
      showCapital,
      capital,
      isExceed,
      loading,
      handleProgress,
      handleChange,
      handleExceed,
      submitUpload,
      handleSuccess,
      handleError
    }
  },

  methods: {
    // 新增提交事件
    addForm(params: object) {
      this.tableData.push(params)
      this.$message({
        type: 'success',
        message: '新增成功'
      })
      database.companyData.pager.total++
      this.$emit('getTableData', true)
      this.layerDom && this.layerDom.close()
    },
    // 编辑提交事件
    updateForm(params: object) {
      update(params)
      .then(res => {
        this.$message({
          type: 'success',
          message: '编辑成功'
        })
        this.$emit('getTableData', false)
        this.layerDom && this.layerDom.close()
      })
    }
  }
})
</script>

<style lang="scss" scoped>
  
</style>