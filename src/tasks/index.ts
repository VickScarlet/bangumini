import { EventIterator } from 'event-iterator'

const tasks = new Map<
    string,
    Set<{
        push: <T>(value: T) => void
        stop: () => void
    }>
>()
export type NextableFn<T> = () => Promise<{
    data: T
    next: NextableFn<T> | null
}>
export async function* asyncGenerator<T>(fn: NextableFn<T>) {
    while (true) {
        const { data, next } = await fn()
        yield data
        if (!next) return
        fn = next
    }
}

export function has(id: string) {
    return tasks.has(id)
}

export default function task(id: string) {
    const tid = (subId: string) => `${id}#${subId}`
    const has = (id: string) => tasks.has(tid(id))
    const task = <T>(id: string, fn: NextableFn<T>) => {
        id = tid(id)
        let streams = tasks.get(id)
        let first = !streams
        if (first) {
            streams = new Set()
            tasks.set(id, streams)
        }
        const iter = new EventIterator<T>(({ push, stop }) => {
            streams!.add({ push: push as <T>(value: T) => void, stop })
        })
        if (first)
            Promise.resolve(asyncGenerator(fn)).then(async (generator) => {
                for await (const data of generator)
                    for (const stream of streams!) stream.push(data)

                for (const stream of streams!) stream.stop()

                tasks.delete(id)
            })

        return iter
    }
    task.has = has
    return task
}
