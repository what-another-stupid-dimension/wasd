import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { PackageJson } from 'type-fest'
import { fileURLToPath } from 'node:url'
import type { PackageMetaInfo } from './types'

// Todo: move to config file (build.config.ts)
const configPath = fileURLToPath(new URL('.', import.meta.url))
const rootPath = path.join(configPath, '../../')
const packagesPath = path.join(rootPath, '/packages')

export default () => {
    const requireModule = createRequire(import.meta.url)
    return fs.readdirSync(packagesPath)
        .filter(
            (folderName) => fs.statSync(path.join(packagesPath, folderName)).isDirectory()
        && fs.existsSync(path.join(packagesPath, folderName, 'package.json')),
        ).map((folderName): PackageMetaInfo => {
            const folderPath = path.join(packagesPath, folderName)
            const packageJsonPath = path.join(folderPath, 'package.json')
            const module = requireModule(packageJsonPath) as PackageJson

            if (!module.name) {
                throw new Error(`Package name is required in ${packageJsonPath}`)
            }

            let internalDependencies: string[] = []
            if (module.dependencies) {
                internalDependencies = Object.keys(module.dependencies).filter((dependency: string) => dependency.startsWith('@wasd/')) || []
            }

            return {
                name: module.name,
                path: folderPath,
                folderName,
                module,
                internalDependencies,
            }
        })
}
