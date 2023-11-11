import Router from '@koa/router'
import { sse } from '@/router'
import * as user from '@/services/user'

export const router = new Router().get('/:user/formername', async ctx => {
    const source = sse(ctx)
    const { data, task } = await user.getFormerName(ctx.params.user)
    if (!task) return source.last({ type: 'done', ...data })
    source.write({ type: 'task', ...data })
    task.then(data => {
        if (!data) source.last({ type: 'none' })
        else source.last({ type: 'done', ...data })
    })
})

export default router
