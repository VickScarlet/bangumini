import Router from '@koa/router'
import { asyncGeneratorSse } from '@/router'
import * as user from '@/services/user'

export const router = new Router()
const withUserName = new Router()
    .get('/formername', async ctx =>
        asyncGeneratorSse(user.getFormerName(ctx.params.user))(ctx)
    )
    .get('/progress_activity', async ctx =>
        asyncGeneratorSse(user.getProgressActivity(ctx.params.user))(ctx)
    )

export default router.use('/:user', withUserName.routes())
