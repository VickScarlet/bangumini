import { getHistoryName } from '@/api/bangumi'

async function main() {
    try {
        const start = Date.now()
        const items = await getHistoryName('furukawa')
        console.debug(items)
        console.debug(Date.now() - start)
    } catch (err) {
        console.debug(err)
    }
}

main()
