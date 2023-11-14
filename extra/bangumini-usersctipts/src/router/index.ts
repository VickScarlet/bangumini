import Router from './router'
import user from './user'
export { Router }
export const router = new Router().use('/user', user.routes())

export default router
