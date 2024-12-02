<template>
  <div class="layout-container" v-loading="loading">
    <el-row justify="center">
      <el-col class="ep-bg-purple-light" :xs="22" :sm="22" :md="20" :lg="15" :xl="15">
        <div style="text-align: left; padding: 15px;">
          <!-- <el-button @click="print">打印</el-button> -->
          <el-upload
            class="upload-demo"
            drag
            :action="uploadUrl"
            :on-progress="handleProgress"
            :on-success="handleSuccess"
            multiple
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽文件到此 或 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                文档小于500kb
              </div>
            </template>
          </el-upload>
          <div v-if="showArticle" class="article-container">
            <h1>{{ filename }}【提纲】</h1>
              <article>
                <section>
                  <div v-for="[key, value] in fileContent" :id="key">
                    <h2 v-if="key.split('.').length == 1" style="margin-top: 40px;">
                      {{ value.head }}
                    </h2>
                    <h3 v-else-if="key.split('.').length == 2" style="margin-top: 40px;">
                      {{ value.head }}
                    </h3>
                    <h4 v-else-if="key.split('.').length == 3" style="margin-top: 40px;">
                      {{ value.head }}
                    </h4>

                    <p v-if="value.abstract">{{ value.abstract }}</p>
                  </div>
                </section>
              </article>
            <el-affix target=".article-container" :offset="20" position="bottom">
              <el-button type="primary" @click="drawer=true" size="middle">
                显示目录
              </el-button>
            </el-affix>
            <el-drawer
              v-model="drawer"
              title="目录"
              direction="rtl"
            >
              <el-tree
                style="max-width: 600px"
                :data="indexData"
                :props="defaultProps"
                default-expand-all
                @node-click="handleNodeClick"
              />
            </el-drawer>
          </div>

        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import { UploadFilled } from '@element-plus/icons-vue'
  import { Ref, ref } from 'vue'
  interface Tree {
    label: string
    content: string
    link: string
    children?: Tree[]
  }

  const baseURL: any = import.meta.env.VITE_BASE_URL
  
  const uploadUrl = baseURL + '/abstract'
  const drawer = ref(false)
  const indexData: Ref<Tree[]> = ref([])
  const showArticle = ref(false)
  const filename = ref('')
  const fileContent = ref({})
  const loading = ref(false)

  const handleNodeClick = (indexData) => {
    console.log(indexData)
    const section = document.getElementById(indexData.link);
    section.scrollIntoView({ behavior: 'smooth' });
  }

  const defaultProps = {
    children: 'children',
    label: 'label',
  }

  const handleProgress = (evt) => {
    loading.value = true
    console.log(evt)
  }

  const handleSuccess = (response, file, fileList) => {
    console.log("成功上传", response['result'])
    filename.value = response['filename']
    fileContent.value = response['result']
    fileContent.value = Object.entries(fileContent.value).sort(
      ([keyA], [keyB]) => keyA.localeCompare(keyB)
    );
    showArticle.value = true
    loading.value = false
    indexData.value = directoryToTree(fileContent.value)
  }

  function directoryToTree(dirObj) {
    console.log('dirObj', dirObj)
    // 定义树形结构数组
    let tree: Tree[] = []
    let currLevel = 1
    let currTree = tree

    function addNode(currTree, item) {
      console.log('item', item)
      currTree.push({
        label: item[1]['head'],
        children: [],
        link: item[0]
      })
    }

    dirObj.forEach(item => {
      if (currLevel == item[0].split('.').length) {
        // 同一级别直接，根据currLevel向tree中添加node
        addNode(currTree, item)
      } else if (currLevel < item[0].split('.').length) {
        currTree = currTree[currTree.length - 1].children
        addNode(currTree, item)
        currLevel += 1
      } else if (currLevel == 3 && item[0].split('.').length == 2) {
        currTree = tree[tree.length - 1].children
        addNode(currTree, item)
        currLevel = 2
      } else if (currLevel == 3 && item[0].split('.').length == 1) {
        currTree = tree
        addNode(tree, item)
        currLevel = 1
      }
    })

    return tree;
  }


</script>

<style lang="scss" scoped>
</style>