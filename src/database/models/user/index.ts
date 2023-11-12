export * as formerName from './former_name'
export * as progressActivity from './progress_activity'
import initFormerName from './former_name'
import initProgressActivity from './progress_activity'

export default async function () {
    await initFormerName()
    await initProgressActivity()
}
