import {
    Middleware,
    ServerContainerProperties,
    Service,
    ServiceClass,
    ServiceContainer,
    ServiceDescriptor,
    ServiceFactory,
    ServiceFactoryOrClass,
    ServiceLifetime,
    Token,
    Value,
    ValueDescriptor,
} from './types'
import { isClass, tokenToString } from './utils'
import { getInjectedServices, getTags } from './decorator'
import {
    ResolveFailedError,
    UnknownServiceError,
    ValueInvalidError,
    ValueNotRegisteredError,
} from './exception'

class Container implements ServiceContainer {
    private registry = new Map<Token<any>, ServiceDescriptor<any>>()

    private singletons = new Map<Token<any>, any>()

    private values = new Map<Token<any>, ValueDescriptor<any>>()

    private resolvingInstances = new Map<Token<any>, Promise<any>>()

    private middlewares: Middleware[] = []

    private onWarning: (message: string) => void

    private onDebug: (message: string) => void

    private onAutoResolve: (service: ServiceDescriptor<object>) => void

    constructor({
        onWarning,
        onDebug,
        onAutoResolve,
    } : ServerContainerProperties = {}) {
        this.registerService(Container, () => this)
        // eslint-disable-next-line no-console
        this.onWarning = onWarning || console.warn
        this.onDebug = onDebug || (() => {})

        this.onAutoResolve = onAutoResolve || (() => {})
    }

    use(middleware: Middleware): void {
        this.middlewares.push(middleware)
    }

    registerService<T extends Object>(
        token: Token<T>,
        factoryOrClass: ServiceFactoryOrClass<T>,
        lifetime: ServiceLifetime = ServiceLifetime.TRANSIENT,
        parameters: any[] = [],
        tags: string[] = [],
    ): void {
        const factory: ServiceFactory<T> = typeof factoryOrClass === 'function' && !isClass(factoryOrClass)
            ? (factoryOrClass as ServiceFactory<T>)
            : async () => new (factoryOrClass as ServiceClass<T>)(
                ...(await this.resolveConstructorParams(
                    factoryOrClass as ServiceClass<T>,
                    parameters,
                )),
            )

        this.registry.set(token, {
            token,
            lifetime,
            factory,
            parameters,
            tags: [...tags, ...getTags(factoryOrClass as ServiceClass<T>)],
        })
    }

    hasService<T extends Service>(token: Token<T>): boolean {
        return this.registry.has(token)
    }

    tagService(token: Token<any>, tag: string): void {
        const descriptor = this.getServiceDescriptor(token)
        if (!descriptor) throw new UnknownServiceError(token)
        descriptor.tags.push(tag)
    }

    getServiceTokens(): Token<any>[] {
        return Array.from(this.registry.keys())
    }

    getServiceDescriptors(): ServiceDescriptor<any>[] {
        return Array.from(this.registry.values())
    }

    async getTaggedServices(tag: string): Promise<any[]> {
        const servicePromises = Array.from(this.registry.values())
            .filter((descriptor) => descriptor.tags.includes(tag))
            .map((descriptor) => this.resolve(descriptor.token))
        return Promise.all(servicePromises)
    }

    registerValue<T extends Value>(
        token: Token<T>,
        value: T,
        validator?: (value: T) => boolean,
    ): void {
        this.values.set(token, {
            token, current: value, validator, history: [],
        })
    }

    setValue<T extends Value>(token: Token<T>, value: T): void {
        const descriptor = this.values.get(token)
        if (!descriptor) throw new ValueNotRegisteredError(token)
        if (descriptor.validator && !descriptor.validator(value)) throw new ValueInvalidError(token)
        this.values.set(token, {
            ...descriptor,
            current: value,
            history: [...descriptor.history, descriptor.current],
        })
    }

    getValue<T extends Value>(token: Token<T>): T {
        const descriptor = this.values.get(token)
        if (!descriptor) throw new ValueNotRegisteredError(token)
        return descriptor.current
    }

    hasValue<T extends Value>(token: Token<T>): boolean {
        return this.values.has(token)
    }

    getValueHistory<T extends Value>(token: Token<T>): T[] {
        const descriptor = this.values.get(token)
        if (!descriptor) throw new ValueNotRegisteredError(token)
        return descriptor.history
    }

    async resolve<T>(
        token: Token<T>,
        resolvingTokens: Set<Token<any>> = new Set(),
    ): Promise<T> {
        if (this.values.has(token)) return this.getValue(token as Token<Value>) as T
        if (resolvingTokens.has(token)) throw new ResolveFailedError(token, new Error('Circular dependency detected'))
        resolvingTokens.add(token)

        try {
            if (this.values.has(token)) return this.getValue(token as Token<Value>) as T
            const descriptor = this.getServiceDescriptor(token as Token<Service>)
            if (!descriptor) throw new UnknownServiceError(token)
            return await this.resolveService(descriptor) as T
        } finally {
            resolvingTokens.delete(token)
        }
    }

    async resolveOptional<T>(token: Token<T>): Promise<T | undefined> {
        return this.resolve(token).catch(() => {
            this.onDebug(`Optional ${tokenToString(token)} is missing: Resolving as undefined`)
            return undefined
        })
    }

    private async resolveConstructorParams<T extends Object>(
        target: ServiceClass<T>,
        parameters: any[],
        resolvingTokens: Set<Token<any>> = new Set(),
    ): Promise<any[]> {
        const services = getInjectedServices(target) || []
        return Promise.all(
            services.map((service, index) => parameters[index] ?? (
                service.optional
                    ? this.resolveOptional(service.token)
                    : this.autoRegisterAndResolve(service, target, index, resolvingTokens)
            )),
        )
    }

    private async autoRegisterAndResolve<T extends Object>(
        service: { token: Token<any>; optional: boolean },
        target: ServiceClass<T>,
        index: number,
        resolvingTokens: Set<Token<any>>,
    ): Promise<any> {
        if (!this.registry.has(service.token) && isClass(service.token)) {
            this.onWarning(`${tokenToString(service.token)} is missing (${target.name} argument ${index}): Auto-registering as singleton`)
            this.registerService(
                service.token as Token<Object>,
                service.token as ServiceClass<Object>,
                ServiceLifetime.SINGLETON,
            )
            return this.resolve(service.token, resolvingTokens)
                .then((resolvedService) => {
                    const descriptor = this.getServiceDescriptor(service.token as Token<Object>)
                    if (descriptor) this.onAutoResolve(descriptor)
                    return resolvedService
                })
        }
        return this.resolve(service.token, resolvingTokens)
    }

    private async resolveService<T extends Service>(descriptor: ServiceDescriptor<T>): Promise<T> {
        return this.executeMiddlewares<T>(descriptor, descriptor.token as Token<T>)
    }

    private getServiceDescriptor<T extends Service>(token: Token<T>): ServiceDescriptor<T> | null {
        return this.registry.get(token) || null
    }

    private async executeMiddlewares<T extends Service>(
        descriptor: ServiceDescriptor<T>,
        token: Token<T>,
    ): Promise<T> {
        const createResolver = (index: number): (() => Promise<T>) => async () => (
            index < this.middlewares.length
                ? this.middlewares[index](token, this, createResolver(index + 1))
                : this.resolveInstance(descriptor)
        )
        return createResolver(0)()
    }

    private async resolveInstance<T extends Service>(descriptor: ServiceDescriptor<T>): Promise<T> {
        if (
            this.resolvingInstances.has(descriptor.token)
            && descriptor.lifetime === ServiceLifetime.SINGLETON
        ) {
            return this.resolvingInstances.get(descriptor.token) as Promise<T>
        }

        const resolvingPromise = (async () => {
            if (
                descriptor.lifetime === ServiceLifetime.SINGLETON
                && this.singletons.has(descriptor.token)
            ) {
                return this.singletons.get(descriptor.token)
            }

            const instance = await descriptor.factory(this)
            if (descriptor.lifetime === ServiceLifetime.SINGLETON) {
                this.singletons.set(descriptor.token, instance)
            }
            return instance
        })()

        this.resolvingInstances.set(descriptor.token, resolvingPromise)

        try {
            return await resolvingPromise
        } finally {
            this.resolvingInstances.delete(descriptor.token)
        }
    }
}

export default Container
