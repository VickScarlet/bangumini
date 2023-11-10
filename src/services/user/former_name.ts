import { userFormerName } from '@/api/bangumi'
import { formerName as db } from '@/database/models/user'

export default async function (id: string) {
    const dbDatas = await db.get(id)
    if (!dbDatas || dbDatas.length === 0) {
        const fetchDatas = await userFormerName(id)
        await db.put(id, fetchDatas)
        return fetchDatas
    } else {
        const { tml, update } = dbDatas[0]
        if (Date.now() - update.getTime() < 86400000) return dbDatas
        const fetchDatas = await userFormerName(id, tml)
        await db.put(id, fetchDatas)
        return [fetchDatas, dbDatas].flat()
    }
}
