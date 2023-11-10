export * as user from './user'
import initUser from './user'

export default async function () {
    await initUser()
}
