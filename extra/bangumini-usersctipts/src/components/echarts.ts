export function drawActivity(element: HTMLDivElement | HTMLCanvasElement) {
    const chart = echarts.init(element)
    const resize = () => chart.resize()
    const update = (raw: Map<string, number>, start: Date, end: Date) => {
        const date = []
        const data = []
        let time = new Date(end)
        while (time >= start) {
            const t = time.toISOString().slice(0, 10)
            date.push(t)
            data.push(raw.get(t) ?? 0)
            time.setDate(time.getDate() - 1)
        }
        chart.setOption({
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: date },
            yAxis: { type: 'value' },
            toolbox: { feature: { restore: {}, saveAsImage: {} } },
            dataZoom: [
                { type: 'inside', start: 0, end: 100 },
                { start: 0, end: 10 },
            ],
            grid: { left: 35, right: 35, top: 10 },
            series: [
                { data, type: 'bar', name: '格子数', itemStyle: { color: '#e19699' } },
            ],
        })
    }
    return { update, resize }
}
