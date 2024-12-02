/*
 * @Date: 2022-09-25 20:07:27
 * @Description: 
 */
import type { Route } from '../index.type'
import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route: Route[] = [
  {
    path: '/researchStructed',
    component: Layout,
    redirect: '/researchStructed/index',
    meta: { title: 'AI调研助手', icon: 'sfont system-chart' },
    children: [
      {
        path: 'index',
        component: createNameComponent(() => import('@/views/main/researchStructed/index.vue')),
        meta: { title: 'AI调研助手', icon: 'sfont system-chart' }
      }
    ]
  }
]

export default route