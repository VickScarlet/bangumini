import { userFormerName } from '@/api/bangumi'
import { formerName as db } from '@/database/models/user'
import { task } from '@/tasks'

const fresh = async (id: string, tml?: number) =>
    task(`user/formerName/${id}`, async () => {
        const fetchDatas = await userFormerName(id, tml)
        if (!fetchDatas || fetchDatas.length === 0) return null
        await db.put(id, fetchDatas)
        return db.get(id)
    })

export default async function* (id: string) {
    const data = await db.get(id)
    if (!data) {
        yield { type: 'task' }
        yield { type: 'done', ...(await fresh(id)) }
    } else if (Date.now() - data.update.getTime() > 86400000) {
        yield { type: 'task', ...data }
        yield { type: 'done', ...(await fresh(id, data.data[0]?.tml)) }
    } else {
        yield { type: 'done', ...data }
    }
}
