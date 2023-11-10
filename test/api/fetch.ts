import { fetch } from '@/api/bangumi'

describe('Bangumi/Fetch', () => {
    it('cookie', async () => {
        if (/呜咕，出错了/.test(await fetch('subject/354255')))
            throw new Error('呜咕，出错了')
    }).timeout(Number.MAX_VALUE)
})
