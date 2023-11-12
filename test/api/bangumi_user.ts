import {
    userFormerName,
    userProgressActivity,
    convertDate,
} from '@/api/bangumi'

describe('Bangumi/User', () => {
    // it('userFormerName', async () => {
    //     await userFormerName('soranomethod')
    // }).timeout(Number.MAX_VALUE)
    it('userProgressActivity', async () => {
        const yesterday = convertDate('2023-11-02')
        const result = await userProgressActivity('vickscarlet', yesterday)
        console.debug(result)
    }).timeout(Number.MAX_VALUE)
})
