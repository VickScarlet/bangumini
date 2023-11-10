import { userFormerName } from '@/api/bangumi'

describe('Bangumi User', () => {
    it('userFormerName', async () => {
        console.debug(await userFormerName('soranomethod'))
    }).timeout(Number.MAX_VALUE)
})
