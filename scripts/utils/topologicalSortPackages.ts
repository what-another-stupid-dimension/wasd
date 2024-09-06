import { PackageMetaInfo } from './types'

/**
 * Sort packages based on their internalDependencies using Topological Sort (Kahn's Algorithm)
 * @param packages Array of PackageMetaInfo
 * @returns Array of PackageMetaInfo sorted based on dependencies
 */
export default (packages: PackageMetaInfo[]): PackageMetaInfo[] => {
    const packageMap: Map<string, PackageMetaInfo> = new Map()
    packages.forEach((pkg) => packageMap.set(pkg.name, pkg))

    const inDegree: Map<string, number> = new Map()
    const adjList: Map<string, string[]> = new Map()

    packages.forEach((pkg) => {
        inDegree.set(pkg.name, 0)
        adjList.set(pkg.name, [])
    })

    packages.forEach((pkg) => {
        pkg.internalDependencies.forEach((dep) => {
            if (packageMap.has(dep)) {
                adjList.get(dep)!.push(pkg.name) // dep -> pkg
                inDegree.set(pkg.name, (inDegree.get(pkg.name) || 0) + 1)
            }
        })
    })

    const queue: PackageMetaInfo[] = []
    packages.forEach((pkg) => {
        if (inDegree.get(pkg.name) === 0) {
            queue.push(pkg)
        }
    })

    const sortedPackages: PackageMetaInfo[] = []

    while (queue.length > 0) {
        const current = queue.shift()!
        sortedPackages.push(current)

        adjList.get(current.name)!.forEach((neighbor) => {
            inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1)
            if (inDegree.get(neighbor) === 0) {
                queue.push(packageMap.get(neighbor)!)
            }
        })
    }

    if (sortedPackages.length !== packages.length) {
        throw new Error('Circular dependency detected.')
    }

    return sortedPackages
}
