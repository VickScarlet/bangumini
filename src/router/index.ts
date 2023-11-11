import Router from '@koa/router'
import user from './user'
import type { Context } from 'koa'
import { PassThrough } from 'node:stream'

export const router = new Router()
    .get('/', async ctx => {
        ctx.body = 'Hello World'
    })
    .use('/user', user.routes())

export default router

const format = <T>(data: T) =>
    `event: message\ndata: ${JSON.stringify(data)}\n\n`

export const sse = (ctx: Context) => {
    ctx.request.socket.setTimeout(0)
    ctx.req.socket.setNoDelay(true)
    ctx.req.socket.setKeepAlive(true)
    ctx.set('Content-Type', 'text/event-stream')
    ctx.set('Cache-Control', 'no-store')
    const stream = new PassThrough()
    ctx.body = stream
    ctx.status = 200

    return {
        write: <T>(data: T) => stream.write(format(data)),
        close: () => stream.end(),
        last: <T>(data: T) => {
            stream.write(format(data))
            stream.end()
        },
        onclose: (listener: () => void) => stream.on('close', listener),
    }
}
