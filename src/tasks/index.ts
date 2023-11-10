export type Callback<T = unknown> = (data: T) => void
const tasks = new Map<string, Set<Callback>>()

export const hasTask = (id: string) => {
    return tasks.has(id)
}

export const addTask = <T>(id: string, task: Promise<T>) => {
    if (tasks.has(id)) return
    tasks.set(id, new Set<Callback>())
    task.then(data => {
        const callbacks = tasks.get(id)
        if (!callbacks) return
        for (const callback of callbacks)
            try {
                callback(data)
            } catch (err) {
                console.error(err)
            }
        tasks.delete(id)
    })
}

export const addCallback = <T>(id: string, callback: Callback<T>) => {
    const callbacks = tasks.get(id)
    if (!callbacks) return
    callbacks.add(callback as Callback)
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
