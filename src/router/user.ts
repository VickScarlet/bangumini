import Router from '@koa/router'
import * as user from '@/services/user'

export const router = new Router().get('/:user/formername', async ctx => {
    ctx.body = await user.getFormerName(ctx.params.user)
})

export default router
