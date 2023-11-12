import { userFormerName as fetch, type FormerNameResult } from '@/api/bangumi'
import { formerName as db } from '@/database/models/user'
import taskGen from '@/tasks'

const timing = (last: Date) => Date.now() - last.getTime() > 86400000
const task = taskGen('user/progressActivity')

interface FormerNameData {
    status: string
    done: boolean
    data?: FormerNameResult['data']
}

const refresh = (id: string, endpoint?: number) => {
    const loop = async (step: number = 1, n?: number) => {
        try {
            const fetchDatas = await fetch(id, endpoint, n)
            if (!fetchDatas) return { data: { status: 'done', done: true }, next: null }
            const { data, done, next } = fetchDatas
            if (data.length !== 0) await db.put(id, data)
            const status = done ? 'done' : `step-${step}`
            return {
                data: { status, done, data } as FormerNameData,
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
        if (!done) stream = refresh(id, data.data[0]?.tml)
    }
    if (!stream) return
    for await (const data of stream) {
        yield { update, ...data }
    }
}
