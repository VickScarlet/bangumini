import Router from '@koa/router'
import user from './user'

export const router = new Router()
    .get('/', async ctx => {
        ctx.body = 'Hello World'
    })
    .use('/user', user.routes())

export default router
