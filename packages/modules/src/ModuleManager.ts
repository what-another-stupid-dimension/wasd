/* eslint-disable no-await-in-loop */
import {
    Container,
    ServiceLifetime,
} from '@wasd/di'
import {
    Module,
    ModuleConstructor,
    ModuleFactory,
    ModuleLifecycleMethod,
    ModulePriority,
} from './types'

export default class ModuleManager {
    private readonly container: Container

    private readonly modules: ModuleConstructor<any>[] = []

    constructor(container: Container) {
        this.container = container
        this.container.registerService(ModuleManager, () => this)
    }

    addModule<T extends Module>(
        moduleClass: ModuleConstructor<T>,
        factoryOrLifetime: ModuleFactory<T> | ServiceLifetime = ServiceLifetime.SINGLETON,
        lifetime: ServiceLifetime = ServiceLifetime.SINGLETON,
    ): void {
        const factory = typeof factoryOrLifetime === 'function' ? factoryOrLifetime : moduleClass
        const serviceLifetime = typeof factoryOrLifetime === 'function' ? lifetime : factoryOrLifetime

        this.container.registerService(moduleClass, factory, serviceLifetime, [], ['module'])
        this.modules.push(moduleClass)
    }

    async loadModules(): Promise<void> {
        await this.container.getTaggedServices('module')
    }

    async runLifecycleMethods(...methods: ModuleLifecycleMethod[]): Promise<void> {
        // eslint-disable-next-line no-restricted-syntax
        for (const method of methods) await this.runLifecycleMethod(method)
    }

    async runLifecycleMethod(
        method: ModuleLifecycleMethod,
        properties: any[] = [],
    ): Promise<void> {
        const modules = await this.getModulesByPriority()
        // eslint-disable-next-line no-restricted-syntax
        for (const module of modules) {
            if (module[method]) {
                if (method === ModuleLifecycleMethod.OnUpdate) {
                    await module[method](...(properties as [number, number]))
                } else {
                    await module[method]()
                }
            }
        }
    }

    async getModulesByPriority(): Promise<Module[]> {
        const modules: Module[] = await this.container.getTaggedServices('module')
        return modules.sort((a, b) => (b.priority || ModulePriority.CUSTOM)
            - (a.priority || ModulePriority.CUSTOM))
    }
}
