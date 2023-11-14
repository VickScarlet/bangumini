import { Router } from '@/router'
import user from '@/pages/user'

export const router = new Router().add('/:user', async (ctx) => {
    user(ctx.params.user)
})

export default router
