<template>
  <Layer :layer="layer" @confirm="submit" ref="layerDom">
    <el-upload
      ref="upload"
      class="upload-demo"
      drag
      :action="uploadUrl"
      :limit="1"
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
    <el-form 
      :model="form" 
      :rules="rules" 
      ref="ruleForm" 
      label-width="160px" 
      style="margin-right:30px;"
      v-loading="loading"
    >
      <el-form-item label="企业/园区名称：" prop="name">
        <el-input v-model="form.name" placeholder="请输入企业或园区名称"></el-input>
      </el-form-item>
      <el-form-item label="总部位置：" prop="text">
        <el-input v-model="form.location" placeholder=""></el-input>
      </el-form-item>
			<el-form-item label="产业方向：" prop="select">
        <el-input v-model="form.industry" placeholder=""></el-input>
			</el-form-item>
      <el-form-item label="企业规模：" prop="radio">
        <el-radio-group v-model="form.scale">
          <el-radio v-for="item in SCALE_ENUM" :key="item" :label="item">{{ item }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="showCapital" class="el-upload__tip text-red" style="color: red">
          {{ capital }}
          <hr>
          企业信息仅供参考，请自行核对
      </div>
      <el-button style="margin-bottom: 10px;margin-top: 10px" size="middle" type="success" @click="submitUpload">
        AI解析调研文件
      </el-button>
      <el-form-item label="产业空间需求：" prop="text">
        <el-input v-model="form.space" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="产业服务需求：" prop="text">
        <el-input v-model="form.industry_service" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="生活服务及配套需求：" prop="text">
        <el-input v-model="form.life_and_infrastructure" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="人才需求：" prop="text">
        <el-input v-model="form.talents" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="其他需求：" prop="text">
        <el-input v-model="form.others" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <el-dialog
      v-model="dialogVisible"
      title="该企业基础信息如下，仅供参考，请自行校对正误！"
      width="500"
    >
      <li>企业名称：{{ resData.name }}</li>
      <li>总部位置：{{ resData.location }}</li>
      <li>产业方向：{{ resData.industry }}</li>
      <li>实缴金额：{{ resData.scale }}</li>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
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
      console.log(files.name);
      if (form.value.name=='') {
        const regex = /(?:[_\-\d\w]*?)([^_\-\d\w]+(公司|集团|产业园|园区))/;
        const match = files.name.match(regex)
        if (match) {
          form.value.name = match[1]
        }
      }
    }

    const isExceed = ref(false)
    const handleExceed: UploadProps['onExceed'] = (files) => {
      isExceed.value = true
      upload.value!.clearFiles()
      const file = files[0] as UploadRawFile
      file.uid = genFileId()
      upload.value!.handleStart(file)
    }

    const loading = ref(false)
    const handleProgress = (evt) => {
      loading.value = true
      console.log(evt)
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
      

      if (form.value.name == '') {
        form.value.name = response['name']
      }
      if (form.value.location == '') {
        form.value.location = response['location']
      }
      if (form.value.industry == '') {
        form.value.industry = response['industry']
      }
      if (form.value.scale == '') {
        showCapital.value = true
        capital.value = response['scale']
      }
      form.value.space = response['产业空间需求']
      form.value.industry_service = response['产业服务需求']
      form.value.life_and_infrastructure = response['生活服务及配套需求']
      form.value.talents = response['人才需求']
      form.value.others = response['其他需求']
      form.value.source = response['filename']
      // 处理上传成功的响应数据
    }

    const handleError = (err, file, fileList) => {
      console.error('文件上传失败', err);
      // 处理上传失败的错误
    };


    return {
      SCALE_ENUM,
      form,
      rules,
      layerDom,
      ruleForm,
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
    submit() {
      if (this.ruleForm) {
        this.ruleForm.validate((valid) => {
          if (valid) {
            let params = this.form
            if (this.layer.row) {
              this.updateForm(params)
            } else {
              this.addForm(params)
            }
          } else {
            return false;
          }
        });
      }
    },
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