import initDb from '@/database'

export interface Config {
    database: {
        name: string
        version: number
    }
}

export default async function (config: Config) {
    const { name, version } = config.database
    await initDb(name, version)
}
