import createSource from 'bangumini-source'
import { apiPath } from '@/api'

export const getProgressActivity = (user: string) =>
    createSource(apiPath(`user/${user}/progress_activity`))
export const getFormerName = (user: string) =>
    createSource(apiPath(`user/${user}/former_name`))
