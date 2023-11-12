import { userProgressActivity as fetch, type ProgressActivityResult } from '@/api/bangumi'
import { progressActivity as db } from '@/database/models/user'
import taskGen from '@/tasks'

const timing = (last: Date) => Date.now() - last.getTime() > 86400000
const task = taskGen('user/progressActivity')

interface ProgressActivityData {
    status: string
    done: boolean
    data?: ProgressActivityResult['data']
}

const refresh = (id: string, endpoint?: string) => {
    let cache = new Map<string, number>()
    const loop = async (step: number = 1, n?: number) => {
        try {
            const fetchDatas = await fetch(id, endpoint, n)
            if (!fetchDatas) {
                if (cache.size !== 0) {
                    const update = Array.from(cache.entries()).map(
                        ([time, activity]) => ({ time, activity })
                    )
                    await db.put(id, update)
                }
                return { data: { status: 'done', done: true }, next: null }
            }
            const { data, done, next } = fetchDatas
            const newCache = new Map<string, number>()
            const update = []
            for (const { time, activity } of data)
                newCache.set(time, activity + (cache.get(time) ?? 0))
            for (const [time, activity] of cache.entries())
                if (!newCache.has(time)) update.push({ time, activity })
            if (update.length !== 0) await db.put(id, update)
            cache = newCache
            const status = done ? 'done' : `step-${step}`
            return {
                data: { status, done, data } as ProgressActivityData,
                next: next ? () => loop(step + 1, next) : null,
            }
        } catch {
            return { data: { status: 'not-found', done: true }, next: null }
        }
    }
    return task(id, loop)
}

export default async function* (id: string) {
    const update = new Date()
    const data = await db.get(id)
    let stream
    if (!data) {
        yield { status: 'new', update, done: false }
        stream = refresh(id)
    } else {
        const done = !(task.has(id) || timing(data.update))
        yield { status: 'db-cache', done, ...data }
        if (!done) stream = refresh(id, data.data[0]?.time)
    }
    if (!stream) return
    for await (const data of stream) {
        yield { update, ...data }
    }
}
