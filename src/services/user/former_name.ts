import { userFormerName } from '@/api/bangumi'
import { formerName as db } from '@/database/models/user'
import { addTask, hasTask } from '@/tasks'

const fresh = (id: string, tml?: number) => {
    const task = `user/formerName/${id}`
    if (hasTask(task)) return
    addTask(
        task,
        (async () => {
            const fetchDatas = await userFormerName(id, tml)
            await db.put(id, fetchDatas)
            return fetchDatas
        })()
    )
}

export default async function (id: string) {
    const dbDatas = await db.get(id)
    if (!dbDatas || dbDatas.length === 0) {
        fresh(id)
    } else {
        const { tml, update } = dbDatas[0]
        if (Date.now() - update.getTime() > 86400000) fresh(id, tml)
    }
    return dbDatas
}
