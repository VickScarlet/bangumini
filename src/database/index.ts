import { init, down } from './conn'
import initModels from './models'

export default {
    async init(...args: Parameters<typeof init>) {
        const db = await init(...args)
        await initModels()
        return db
    },
    down,
}

export * from './models'
