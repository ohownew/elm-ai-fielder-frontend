/**
 * 前端路由管理
 **/

/** 路由类型 */
import type { Route } from '../index.type'

/** 引入需要权限的Modules */
import Dashboard from '../modules/dashboard'
import ResearchStructed from '../modules/researchStructed'
import DocAbstract from '../modules/docAbstract'
import Search from '../modules/search'


/** 登录后需要动态加入的本地路由 */
const FrontRoutes: Route[] = [
  ...Dashboard,
  ...ResearchStructed,
  ...Search,
  ...DocAbstract,
]

export default FrontRoutes