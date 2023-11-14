import createSource from 'bangumini-source'
import { apiPath } from '@/api'

export interface EventSourceData<T> {
    status: string // 状态 [new, done, not-found, db-cache, step-{N}]
    done: boolean // 是否更新完成
    update: string // 更新时间 [UTC]
    data?: T // 数据 [类型根据接口数据而定]
}

export interface FormerName {
    tml: number // 时间线ID
    time: string // 改名时间 [YYYY-MM-DD]
    before: string // 改名前
    after: string // 改名后
}

export interface ProgressActivity {
    time: string // 改名时间 [YYYY-MM-DD]
    activity: number // 活跃度
}

export const getProgressActivity = (user: string) =>
    createSource<EventSourceData<ProgressActivity[]>>(
        apiPath(`user/${user}/progress_activity`)
    )
export const getFormerName = (user: string) =>
    createSource<EventSourceData<FormerName[]>>(apiPath(`user/${user}/former_name`))
