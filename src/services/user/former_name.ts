import { userFormerName } from '@/api/bangumi'
import { formerName as db } from '@/database/models/user'
import { task } from '@/tasks'

const fresh = async (id: string, tml?: number) =>
    task(`user/formerName/${id}`, async () => {
        const fetchDatas = await userFormerName(id, tml)
        if (fetchDatas && fetchDatas.length !== 0) await db.put(id, fetchDatas)
        return fetchDatas
    })

export default async function (id: string) {
    const data = await db.get(id)
    if (!data) return { data: null, task: fresh(id) }
    if (Date.now() - data.update.getTime() > 86400000)
        return { data, task: fresh(id, data.data[0]?.tml) }
    return { data, task: null }
}
