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

export interface FormerNameWithUpdate extends FormerName {
    update: Date
}

export const get = async (id: string) => {
    return coll()
        .find<FormerNameWithUpdate>(
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
}

export const put = async (id: string, formerNames: FormerName[]) => {
    const update = new Date()
    const data = formerNames.map(formerName => ({ id, update, ...formerName }))
    return coll().insertMany(data, { ordered: false })
}
