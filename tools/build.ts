import yaml from 'js-yaml'
import { readFile, writeFile } from 'fs/promises'

interface Config {
    api: {
        headers: {
            USER_AGENT: string
            COOKIE: string
        }
    }
}

async function genRsConfig(cPath: string, dPath: string) {
    const content = await readFile(cPath, 'utf-8')
    const config = yaml.load(content) as Config
    const writeContent = Object.entries(config.api.headers)
        .map(
            ([name, value]) => `pub static ${name}: &'static str = r"${value}";`
        )
        .join('\n')
    const lastContent = await readFile(dPath, 'utf-8')
    if (writeContent === lastContent) return
    await writeFile(dPath, writeContent)
}

genRsConfig('config.yaml', 'src/api/bangumi/src/config.rs')
