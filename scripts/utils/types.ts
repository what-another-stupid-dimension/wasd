import { PackageJson } from 'type-fest'

export type PackageMetaInfo = {
    name: string,
    path: string,
    folderName: string,
    internalDependencies: string[],
    module: PackageJson,
}
