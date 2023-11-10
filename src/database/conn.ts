import { MongoClient, type Db } from 'mongodb'

export interface Config {
    uri: ConstructorParameters<typeof MongoClient>[0]
    opts: ConstructorParameters<typeof MongoClient>[1]
    dbName: Parameters<MongoClient['db']>[0]
    dbOpts: Parameters<MongoClient['db']>[1]
}

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
export const init = async (cfg: Config) => {
    _client = new MongoClient(cfg.uri, cfg.opts)
    await _client.connect()
    console.info('Connected to MongoDB')
    _db = _client.db(cfg.dbName, cfg.dbOpts)
    return _db
}
export const down = async () => {
    if (!_client) throw new Error('Database not initialized')
    await _client.close()
    console.info('Disconnected from MongoDB')
    _client = null
    _db = null
}
