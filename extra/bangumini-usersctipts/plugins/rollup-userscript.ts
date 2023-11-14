import { type Rollup } from 'vite'
import { readFile } from 'fs/promises'

export interface Options {
    name?: string
    version?: string
    description?: string
    author?: string
    namespace?: string
    include?: string[]
    require?: string[]
    homepage?: string
    homepageURL?: string
    website?: string
    source?: string
    icon?: string
    iconURL?: string
    defaulticon?: string
    icon64?: string
    icon64URL?: string
    updateURL?: string
    downloadURL?: string
    supportURL?: string
    match?: string[]
    exclude?: string[]
    resource?: string[]
    connect?: string[]
    'run-at'?: string
    grant?: string[]
    noframes?: boolean
    unwrap?: boolean
    nocompat?: boolean
    license?: string
}

const keys = [
    'name',
    'version',
    'description',
    'author',
    'namespace',
    'include',
    'require',
    'homepage',
    'homepageURL',
    'website',
    'source',
    'icon',
    'iconURL',
    'defaulticon',
    'icon64',
    'icon64URL',
    'updateURL',
    'downloadURL',
    'supportURL',
    'match',
    'exclude',
    'resource',
    'connect',
    'run-at',
    'grant',
    'noframes',
    'unwrap',
    'nocompat',
    'license',
    'require',
]
interface Header {
    key: string
    value: string
}
const keyLength = Math.max(...keys.map((key) => key.length)) + 8
const formatHeader = ({ key, value }: Header) =>
    `// @${key.padEnd(keyLength, ' ')}${value}`

export default function (options = {}): Rollup.Plugin {
    return {
        name: 'rollup-userscript-plugin',
        async generateBundle(_, bundle) {
            const raw = await readFile('./package.json', 'utf-8')
            const pkg = JSON.parse(raw)
            const assign = Object.assign({}, pkg, pkg.userScript ?? {}, options)
            const banners = [] as Header[]
            for (const key of keys) {
                const value = assign[key]
                if (!value) continue
                if (!Array.isArray(value)) banners.push({ key, value })
                else banners.push(...value.map((value) => ({ key, value })))
            }
            for (const module of Object.values(bundle))
                if (module.type === 'chunk')
                    module.code = `// ==UserScript==
${banners.map(formatHeader).join('\n')}
// ==/UserScript==

(function(){
    'use strict';
    ${module.code}
})()`
        },
    }
}
