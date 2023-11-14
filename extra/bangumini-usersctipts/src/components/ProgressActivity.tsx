import {progress_activity, button, canvas} from './ProgressActivity.module.scss'
import React from 'react'
import ECharts from 'echarts-for-react';
import { getProgressActivity } from '@/api/user'

interface ProgressActivityProp {
    user: string;
}

interface ProgressActivityState {
    show: boolean;
    date: string[];
    data: number[];
}

export default class ProgressActivity extends React.Component<ProgressActivityProp, ProgressActivityState> {
    constructor(props: ProgressActivityProp) {
        super(props)
        this.state = { show: false, date: [], data: [] }
    }

    update(raw: Map<string, number>, start: Date, end: Date) {
        const date = []
        const data = []
        let time = new Date(end)
        while (time >= start) {
            const t = time.toISOString().slice(0, 10)
            date.push(t)
            data.push(raw.get(t) ?? 0)
            time.setDate(time.getDate() - 1)
        }
        this.setState({ date, data })
    }

    async onClick() {
        this.setState({ show: true })
        const raw = new Map()
        let start = new Date('3000-1-1')
        let end = new Date(0)
        const source = getProgressActivity(this.props.user)
        for await (const { data } of source)
            if (data) {
                for (const { time, activity } of data) {
                    const old = raw.get(time) ?? 0
                    raw.set(time, old + activity)
                    const t = new Date(time)
                    if (t < start) start = t
                    if (t > end) end = t
                }
                this.update(raw, start, end)
            }
    }

    render() {
        if (!this.state.show)
            return (
                <div className={progress_activity}>
                    <h3>格子活跃</h3>
                    <div className={button} onClick={this.onClick} onKeyDown={this.onClick}>
                        让我看看
                    </div>
                </div>
            )

        const option = {
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: this.state.date },
            yAxis: { type: 'value' },
            toolbox: { feature: { saveAsImage: {} } },
            dataZoom: [
                { type: 'inside', start: 0, end: 100 },
                { start: 0, end: 10 },
            ],
            grid: { left: 35, right: 35, top: 10 },
            series: [
                { data: this.state.data, type: 'bar', name: '格子数', itemStyle: { color: '#e19699' } },
            ],
        }

        return (<div className={progress_activity}>
            <h3>格子活跃</h3>
            <ECharts className={canvas} option={option} />
        </div>)
    }
}