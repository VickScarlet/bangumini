import '@/style/main.scss'
import initDb from '@/database'
import router from '@/router'

interface Config {
    database: {
        name: string
        version: number
    }
}

async function main(config: Config) {
    const { name, version } = config.database
    await initDb(name, version)
    const routes = router.routes()
    routes(location.pathname)
}

main({
    database: {
        name: 'bangumini',
        version: 1,
    },
})
