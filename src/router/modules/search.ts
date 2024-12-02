/*
 * @Date: 2022-09-25 20:07:27
 * @Description: 
 */
import type { Route } from '../index.type'
import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route: Route[] = [
  {
    path: '/search',
    component: Layout,
    redirect: '/search/index',
    meta: { title: 'AI智慧检索', icon: 'sfont system-yanjing' },
    children: [
      {
        path: 'index',
        component: createNameComponent(() => import('@/views/main/search/index.vue')),
        meta: { title: 'AI智慧检索', icon: 'sfont system-yanjing' }
      }
    ]
  }
]

export default route