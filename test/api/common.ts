import { fetch, convertDate } from '@/api/bangumi'
import assert from 'node:assert'

function day_string(date: Date) {
    const year = '' + date.getFullYear()
    const month = '' + (date.getMonth() + 1)
    const day = '' + date.getDate()
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

describe('Bangumi/Common', () => {
    it('fetch/cookie/nsfw', async () => {
        if (/呜咕，出错了/.test(await fetch('subject/354255')))
            throw new Error('呜咕，出错了')
    }).timeout(Number.MAX_VALUE)

    it('fetch/error', async () => {
        await fetch('error/page')
            .then(() => {
                throw new Error('这里不应该正确')
            })
            .catch(e => assert.equal(e.message, '呜咕，出错了'))
    }).timeout(Number.MAX_VALUE)

    it('convertDate', () => {
        const time = new Date()
        assert.equal(convertDate('今天'), day_string(time))
        time.setDate(time.getDate() - 1)
        assert.equal(convertDate('昨天'), day_string(time))
        time.setDate(time.getDate() - 1)
        assert.equal(convertDate('前天'), day_string(time))
        assert.equal(convertDate('2019-1-1'), '2019-01-01')
        assert.equal(convertDate('2023-5-11'), '2023-05-11')
        assert.equal(convertDate('2011-12-2'), '2011-12-02')
    })
})
