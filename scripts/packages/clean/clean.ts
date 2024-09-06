import path from 'node:path'
import fs from 'node:fs'
import { rimraf } from 'rimraf'
import { PackageMetaInfo } from '../../utils'
import { Cli } from '../../wasd/Cli'

const removeTsBuildInfo = (cli: Cli, packageConfig: PackageMetaInfo) => {
    const file = path.join(packageConfig.path, 'tsconfig.tsbuildinfo')
    if (fs.existsSync(file)) {
        return rimraf(file).then(() => {
            cli.logInfo('Removed tsconfig.tsbuildinfo (created by tsconfig composite)')
        })
    }

    const buildFile = path.join(packageConfig.path, 'tsconfig.build.tsbuildinfo')
    if (fs.existsSync(buildFile)) {
        return rimraf(buildFile).then(() => {
            cli.logInfo('Removed tsconfig.build.tsbuildinfo (created by tsconfig composite)')
        })
    }

    return Promise.resolve()
}

const removeDist = (cli: Cli, packageConfig: PackageMetaInfo) => {
    const folder = path.join(packageConfig.path, 'dist')
    if (fs.existsSync(folder)) {
        return rimraf(folder).then(() => {
            cli.logInfo('Removed dist folder')
        })
    }

    return Promise.resolve()
}

export default (cli: Cli, packageConfig: PackageMetaInfo) => Promise.all([
    removeDist(cli, packageConfig),
    removeTsBuildInfo(cli, packageConfig),
])
