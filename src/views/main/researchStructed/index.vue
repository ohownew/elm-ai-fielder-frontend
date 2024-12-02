<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle">
        <el-button type="primary" :icon="Plus" @click="handleAdd">{{ $t('message.common.add') }}</el-button>
        <el-button type="primary" :icon="Plus" @click="handleAddBatch">批量新增</el-button>
        <el-popconfirm :title="$t('message.common.delTip')" @confirm="handleDel(chooseData)">
          <template #reference>
            <el-button type="danger" :icon="Delete" :disabled="chooseData.length === 0">{{ $t('message.common.delBat') }}</el-button>
          </template>
        </el-popconfirm>
        <el-button type="primary" :icon="CopyDocument" @click="handleCopy">{{ $t('message.common.copyData') }}</el-button>
      </div>
      <div class="layout-container-form-search">
        <el-input v-model="query.input" :placeholder="$t('message.common.searchTip')" @change="getTableData(true)"></el-input>
        <el-button type="primary" :icon="Search" class="search-btn" @click="getTableData(true)">{{ $t('message.common.search') }}</el-button>
      </div>
    </div>
    <div class="layout-container-table">
      <Table
        ref="table"
        v-model:page="page"
        v-loading="loading"
        :showIndex="true"
        :showSelection="true"
        :data="tableData"
        fit
        @getTableData="getTableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="name" label="企业/园区" align="center" />
        <el-table-column prop="location" label="所在位置" align="center" />
        <el-table-column prop="industry" label="产业方向" align="center" />
        <el-table-column prop="scale" label="规模" align="center" />
        <el-table-column prop="space" label="产业空间需求" align="center" />
        <el-table-column prop="industry_service" label="产业服务需求" align="center" />
        <el-table-column prop="life_and_infrastructure" label="生活服务及配套需求" align="center" />
        <el-table-column prop="talents" label="人才需求" align="center" />
        <el-table-column prop="others" label="其他需求" align="center" />
        <el-table-column prop="source" label="信息源" align="center" />
        <el-table-column :label="$t('message.common.handle')" align="center" fixed="right" width="200">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)">{{ $t('message.common.update') }}</el-button>
            <el-popconfirm :title="$t('message.common.delTip')" @confirm="handleDel([scope.row.id])">
              <template #reference>
                <el-button type="danger">{{ $t('message.common.del') }}</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </Table>
      <Layer :layer="layer" @getTableData="getTableData" v-if="layer.show" />
      <LayerBatchAdd :layer="layerBatchAdd" @getTableData="getTableData" v-if="layerBatchAdd.show" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import Table from '@/components/table/index.vue'
import { Page } from '@/components/table/type'
import Layer from './layer.vue'
import LayerBatchAdd from './layerBatchAdd.vue'
import { ElMessage } from 'element-plus'
import type { LayerInterface } from '@/components/layer/index.vue'
import { Plus, Search, Delete, CopyDocument } from '@element-plus/icons'
import { database } from '@/store/data'

export default defineComponent({
  name: 'crudTable',
  components: {
    Table,
    Layer,
    LayerBatchAdd
  },
  setup() {
    // 存储搜索用的数据
    const query = reactive({
      input: ''
    })
    // 弹窗控制器
    const layer: LayerInterface = reactive({
      show: false,
      title: '新增',
      showButton: true
    })
    const layerBatchAdd: LayerInterface = reactive({
      show: false,
      title: '批量新增',
      showButton: true
    })

    const tableData = database.companyData.list //ref([])

    // 分页参数, 供table使用
    const page: Page = reactive({
      index: 1,
      size: 20,
      total: tableData.length
    })
    const loading = ref(true)

    

    const chooseData = ref([])
    const handleSelectionChange = (val: []) => {
      chooseData.value = val
    }
    // 获取表格数据
    // params <init> Boolean ，默认为false，用于判断是否需要初始化分页
    const getTableData = (init: boolean) => {
      loading.value = true
      if (init) {
        page.index = 1
      }
      let params = {
        page: page.index,
        pageSize: page.size,
        ...query
      }

      page.total = tableData.length
      loading.value = false
    }
    // 删除功能
    const handleDel = (data: Int16Array) => {
      console.log(111)
      console.log(data)
      data.forEach(idToRemove => {
        const index = tableData.findIndex(obj => obj.id === idToRemove);
        tableData.splice(index, 1)
      })
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
      getTableData(tableData.length === 1 ? true : false)
    }
    // 新增弹窗功能
    const handleAdd = () => {
      layer.title = '新增数据'
      layer.show = true
      delete layer.row
    }
    // 新增弹窗功能
    const handleAddBatch = () => {
      layerBatchAdd.title = '批量新增数据'
      layerBatchAdd.show = true
      delete layerBatchAdd.row
    }


    // 复制数据功能
    const handleCopy = () => {
      let csvContent = [
            '企业/园区',
            '所在位置',
            '产业方向',
            '规模',
            '产业空间需求',
            '产业服务需求',
            '生活服务及配套',
            '人才需求',
            '其他需求',
            '信息源'
          ].join('\t') + '\r\n'

      tableData.forEach(row => {
        csvContent += (row['name'] + '\t')
        csvContent += (row['location'] + '\t')
        csvContent += (row['industry'] + '\t')
        csvContent += (row['scale'] + '\t')
        csvContent += (row['space'] + '\t')
        csvContent += (row['industry_service'] + '\t')
        csvContent += (row['life_and_infrastructure'] + '\t')
        csvContent += (row['talents'] + '\t')
        csvContent += (row['others'] + '\t')
        csvContent += (row['source'])
        csvContent += '\r\n'
      })

      try {
        // 将文本写入剪贴板
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(csvContent)
        } else {
          const textArea = document.createElement('textarea')
          textArea.value = csvContent
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()
          document.execCommand('copy');
          document.body.removeChild(textArea)
        }
        ElMessage({
          message: '已复制到剪切板',
          type: 'success',
        })
      } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text');
      }
    }

    // 编辑弹窗功能
    const handleEdit = (row: object) => {
      layer.title = '编辑数据'
      layer.row = row
      layer.show = true
    }
    getTableData(true)
    return {
      Plus,
      Search,
      Delete,
      CopyDocument,

      query,
      tableData,
      chooseData,
      loading,
      page,
      layer,
      layerBatchAdd,
      
      handleSelectionChange,
      handleAdd,
      handleAddBatch,
      handleEdit,
      handleCopy,
      handleDel,
      getTableData
    }
  }
})
</script>

<style lang="scss" scoped>
  
</style>