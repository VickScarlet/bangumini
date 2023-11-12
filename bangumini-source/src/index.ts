import EventIterator from 'event-iterator'

const tasks = new Map<
    string,
    Set<{
        push: <T>(value: T) => void
        stop: () => void
    }>
>()

export interface BaseValue {
    done: boolean
}

async function* createEventSource<T extends BaseValue>(url: string) {
    const source = (() => {
        let reslove: ((data: T) => void) | null = null
        let next: Promise<T> | null = new Promise<T>((r) => (reslove = r))
        const source = new EventSource(url)
        source.addEventListener('message', (event) => {
            const r = reslove
            const value = JSON.parse(event.data) as T
            if (value.done) {
                source.close()
                next = null
            } else {
                next = new Promise((r) => (reslove = r))
            }
            r?.(value)
        })
        return {
            next: () => next,
        }
    })()
    while (true) {
        const value = await source.next()
        if (!value) break
        yield value
        if (value?.done) break
    }
}

export function source<T extends BaseValue>(url: string) {
    let streams = tasks.get(url)
    let first = !streams
    if (first) {
        streams = new Set()
        tasks.set(url, streams)
    }
    const iter = new EventIterator<T>(({ push, stop }) => {
        streams!.add({ push: push as <T>(value: T) => void, stop })
    })
    if (first)
        Promise.resolve(createEventSource(url)).then(async (generator) => {
            for await (const data of generator)
                for (const stream of streams!) stream.push(data)

            for (const stream of streams!) stream.stop()

            tasks.delete(url)
        })

    return iter
}

export default source
