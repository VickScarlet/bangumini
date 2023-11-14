import { match } from 'path-to-regexp'
export interface Context {
    req: {
        path: string
        origin: string
        query: string
    }
    path: string
    params: Record<string, string>
    query: Record<string, string>
}

interface BaseRoute {
    sub: boolean
    path: string
}
interface CallbackRoute extends BaseRoute {
    sub: false
    callback: (ctx: Context) => void
}
interface UseRoute extends BaseRoute {
    sub: true
    callback: (path: string, ctx: Context, from?: string) => boolean
}

type Route = CallbackRoute | UseRoute

export class Router {
    private _routes = new Map<string, Route>()
    public routes() {
        const routes = (path: string, ctx?: Context, from = '') => {
            if (!ctx) {
                const re = /(https?:\/\/[^\/?]+)(\/[^?]*)?(\?.*)?/.exec(location.href)
                if (!re) throw new Error('Invalid location')
                const req = { origin: re[1], path, query: re[3] ?? '' }
                const query = Object.fromEntries(new URLSearchParams(req.query).entries())
                ctx = { req, path: re[2] ?? '/', params: {}, query }
            }
            return this.dispatch(path, ctx, from)
        }
        return routes
    }

    public add(path: string, callback: (ctx: Context) => void) {
        this._routes.set(path, {
            sub: false,
            path,
            callback,
        })
        return this
    }

    public use(path: string, router: ReturnType<Router['routes']>) {
        this._routes.set(path, {
            sub: true,
            path,
            callback: router,
        })
        return this
    }

    private dispatch(path: string, ctx: Context, from: string) {
        for (const route of this._routes.values()) {
            const m = from + route.path
            const r = match(m, { end: !route.sub })(path)
            if (!r) continue
            if (route.sub) {
                const ret = route.callback(path, ctx, m)
                if (ret) return true
                continue
            }
            Object.assign(ctx.params, r.params)
            route.callback(ctx)
            return true
        }
        return false
    }
}

export default Router
