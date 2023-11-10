import Koa from 'koa'
import router from '@/router'
import db from '@/database'

async function main() {
    await db.init(['mongodb://127.0.0.1'], ['bangumini'])
    new Koa()
        .use(router.routes())
        .listen({ host: '0.0.0.0', port: 3000 }, () => {
            console.log('Server listening on port 3000')
        })
}
main()
