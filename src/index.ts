import yaml from 'js-yaml'
import { readFile } from 'fs/promises'
import Koa from 'koa'
import cors from '@koa/cors'
import router from '@/router'
import db from '@/database'

interface Config {
    database: import('@/database').Config
}

async function main(cPath: string) {
    const content = await readFile(cPath, 'utf-8')
    const config = yaml.load(content) as Config
    await db.init(config.database)
    new Koa()
        .use(cors())
        .use(router.routes())
        .listen({ host: '0.0.0.0', port: 3000 }, () => {
            console.log('Server listening on port 3000')
        })
}
main('config.yaml')
