/*
 * @Date: 2023-03-10 19:34:30
 * @Description: 
 */
import { createNameComponent } from '../createNode';

/** 首页系列 */
const dashboard = {
  /** 首页 */
  dashboard: createNameComponent(() => import('@/views/main/dashboard/index.vue')),
}

/** 调研信息结构化 */
const researchStructed = {
  /** 调研信息结构化 */
  researchStructed: createNameComponent(() => import('@/views/main/researchStructed/index.vue')),
}

/** 文档提纲 */
const docAbstract = {
  /** 文档提纲 */
  docAbstract: createNameComponent(() => import('@/views/main/docAbstract/index.vue')),
}

/** AI智慧检索 */
const search = {
  /** AI智慧检索 */
  search: createNameComponent(() => import('@/views/main/search/index.vue')),
}


/** 导出所有路由，供后端配置使用 */
const allRoutes = {
  dashboard,
  researchStructed,
  search,
  docAbstract,
}

export default allRoutes