export type Callback<T = unknown> = (data: T) => void
const tasks = new Map<string, Set<Callback>>()

export const hasTask = (id: string) => {
    return tasks.has(id)
}

export const task = async <T>(id: string, task: () => Promise<T>) => {
    const callbacks = tasks.get(id)
    if (callbacks)
        return new Promise<T>(resolve => callbacks.add(resolve as Callback))

    tasks.set(id, new Set<Callback>())
    return task().then(data => {
        const callbacks = tasks.get(id)
        if (callbacks) {
            for (const callback of callbacks)
                try {
                    callback(data)
                } catch (err) {
                    console.error(err)
                }
            tasks.delete(id)
        }
        return data
    })
}

export const removeCallback = (id: string, callback: Callback) => {
    const callbacks = tasks.get(id)
    if (!callbacks) return
    callbacks.delete(callback)
    if (callbacks.size === 0) tasks.delete(id)
}

export const clearTask = (id: string) => {
    const callbacks = tasks.get(id)
    if (!callbacks) return
    callbacks.clear()
    tasks.delete(id)
}

export const clearAllTask = () => {
    tasks.clear()
}
