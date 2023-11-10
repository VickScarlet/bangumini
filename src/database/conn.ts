import { MongoClient, type Db } from 'mongodb'

let _client: MongoClient | null = null
let _db: Db | null = null
export const client = () => {
    if (!_client) throw new Error('Database not initialized')
    return _client
}
export const db = () => {
    if (!_db) throw new Error('Database not initialized')
    return _db
}
export const init = async (
    clientArgs: ConstructorParameters<typeof MongoClient>,
    dbArgs: Parameters<MongoClient['db']>
) => {
    _client = new MongoClient(...clientArgs)
    await _client.connect()
    console.info('Connected to MongoDB')
    _db = _client.db(...dbArgs)
    return _db
}
export const down = async () => {
    if (!_client) throw new Error('Database not initialized')
    await _client.close()
    console.info('Disconnected from MongoDB')
    _client = null
    _db = null
}
