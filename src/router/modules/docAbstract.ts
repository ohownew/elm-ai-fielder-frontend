/*
 * @Date: 2022-09-25 20:07:27
 * @Description: 
 */
import type { Route } from '../index.type'
import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route: Route[] = [
  {
    path: '/docAbstract',
    component: Layout,
    redirect: '/docAbstract/index',
    meta: { title: 'AI摘要助手', icon: 'sfont system-document' },
    children: [
      {
        path: 'index',
        component: createNameComponent(() => import('@/views/main/docAbstract/index.vue')),
        meta: { title: 'AI摘要助手', icon: 'sfont system-document' }
      }
    ]
  }
]

export default route