<template>
  <div class="outer-container">
    <div class="search-container">
      <div class="search-title">AI智慧检索</div>
      <input type="text" v-model="query" placeholder="请输入关键词或问题..." class="search-input" @focus="inputFocus" @blur="inputBlur">
      <span class="search-icon" @click="search">&#128269;</span> <!-- 使用Unicode字符作为搜索图标 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const query = ref('')
const inputFocused = ref(false)

const search = () => {
  console.log('搜索:', query.value)
}

const inputFocus = () => {
  inputFocused.value = true
}

const inputBlur = () => {
  inputFocused.value = false
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

* {
  font-family: 'Roboto', sans-serif;
}

.outer-container {
  width: 100%;
  height: 100%;
  // background: #0A192F; /* 深蓝色背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.search-container {
  position: relative;
  width: 40%;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.search-title {
  color: rgb(44, 62, 80);
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 20px;
}

.search-input {
  width: calc(100% - 50px); /* 减去搜索图标的宽度 */
  padding: 10px 16px;
  padding-right: 50px; /* 留出空间给搜索图标 */
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #007BFF;
}

.search-icon {
  position: absolute;
  top: 70%;
  right: 16px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #007BFF;
  transition: color 0.3s;
}

.search-icon:hover {
  color: #0056b3;
}

/* 动画和响应式设计等其他样式保持不变 */
</style>