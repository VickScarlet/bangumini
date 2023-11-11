import Router from '@koa/router'
import { sse } from '@/router'
import * as user from '@/services/user'

export const router = new Router().get('/:user/formername', async ctx => {
    const source = sse(ctx)
    Promise.resolve(user.getFormerName(ctx.params.user)).then(async tasks => {
        for await (const task of tasks) {
            if (task.type == 'done') source.last(task)
            else source.write(task)
        }
    })
})

export default router
