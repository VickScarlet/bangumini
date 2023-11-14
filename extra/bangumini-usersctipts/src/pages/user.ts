import { getProgressActivity } from '@/api/user'
import { drawActivity } from '@/components/echarts'
export default function (user: string) {
    console.debug('this is', user, 'user page')
    const element = $(`<div class="bangumini progress_activity"><h3>格子活跃</h3></div>`)
    const canvas = $(`<div class="bangumini canvas"></div>`).hide()
    const button = $(`<div class="bangumini button chiiBtn">让我看看</div>`)
    element.append(canvas)
    element.append(button)
    $('#user_home .user_box').prepend(element)
    const { update, resize } = drawActivity(canvas[0] as HTMLDivElement)
    button.on('click', async () => {
        button.hide()
        canvas.show()
        resize()
        const raw = new Map()
        update(raw, new Date(), new Date())
        let start = new Date('3000-1-1')
        let end = new Date(0)
        const source = getProgressActivity(user)
        for await (const { data } of source)
            if (data) {
                for (const { time, activity } of data) {
                    const old = raw.get(time) ?? 0
                    raw.set(time, old + activity)
                    const t = new Date(time)
                    if (t < start) start = t
                    if (t > end) end = t
                }
                update(raw, start, end)
            }
    })
}
