import { db } from '@/database/conn'

const collection = 'former_name'
const coll = () => db().collection(collection)

export default async function () {
    try {
        await db().createCollection(collection)
        await coll().createIndex({ id: 1, tml: 1 }, { unique: true })
    } catch (err) {
        // ignore
    }
}

export interface FormerName {
    tml: number
    before: string
    after: string
    time: string
}

export interface FormerNameUpdate {
    update: Date
}

export const get = async (id: string) => {
    const list = await coll()
        .find<FormerName>(
            { id },
            {
                projection: {
                    _id: 0,
                    id: 0,
                },
            }
        )
        .sort({ tml: -1 })
        .toArray()

    if (list.length === 0) return null
    const { update } = list.pop() as unknown as FormerNameUpdate
    return { update, data: list }
}

export const put = async (id: string, formerNames: FormerName[]) => {
    await coll().updateOne(
        { id, tml: 0 },
        {
            $set: { update: new Date() },
        },
        { upsert: true }
    )
    const data = formerNames.map(formerName => ({ id, ...formerName }))
    return coll().insertMany(data, { ordered: false })
}
