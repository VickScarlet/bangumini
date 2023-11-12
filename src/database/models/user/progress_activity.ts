import { db } from '@/database/conn'

const collection = 'progress_activity'
const coll = () => db().collection(collection)

export default async function () {
    try {
        await db().createCollection(collection)
        await coll().createIndex({ id: 1, time: 1 }, { unique: true })
    } catch (err) {
        // ignore
    }
}

export interface ProgressActivity {
    time: string
    activity: number
}

export interface ProgressActivityUpdate {
    update: Date
}

export const get = async (id: string) => {
    const list = await coll()
        .find<ProgressActivity>(
            { id },
            {
                projection: {
                    _id: 0,
                    id: 0,
                },
            }
        )
        .sort({ time: -1 })
        .toArray()

    if (list.length === 0) return null
    const { update } = list.pop() as unknown as ProgressActivityUpdate
    return { update, data: list }
}

export const put = async (
    id: string,
    progressActivitys: ProgressActivity[]
) => {
    await coll().updateOne(
        { id, time: '0000-00-00' },
        {
            $set: { update: new Date() },
        },
        { upsert: true }
    )
    const data = progressActivitys.map(progressActivity => ({
        id,
        ...progressActivity,
    }))
    return coll().insertMany(data, { ordered: false })
}
