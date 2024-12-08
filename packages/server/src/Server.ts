/* eslint-disable no-await-in-loop */
import {
    Module,
    ModuleConstructor,
    ModuleFactory,
    ModuleLifecycleMethod,
    ModuleManager,
} from '@wasd/modules'
import {
    Container,
    ServiceDescriptor,
    ServiceLifetime,
    Token,
    Value,
} from '@wasd/di'
import {
    Cli,
    CliNamespace,
} from '@wasd/cli'
import ServerProperties from './ServerProperties'
import { bindExitHandler } from './utils'

export default class Server {
    private readonly container: Container

    private readonly moduleManager: ModuleManager

    private isRunning = false

    private isPaused = false

    private tick: number = 0

    private cli: Cli

    constructor(properties: Partial<ServerProperties> = {}) {
        this.container = new Container({
            onWarning: (message) => this.cli.logWarning(message),
            onAutoResolve: (desc) => this.handleAutoResolve(desc),
            onDebug: (message) => this.cli.logDebug(message),
        })

        this.moduleManager = new ModuleManager(this.container)
        this.configureContainer(properties)
        this.cli = this.initializeCLI()
    }

    addModule<T extends Module>(
        moduleClass: ModuleConstructor<T>,
        factoryOrLifetime: ModuleFactory<T> | ServiceLifetime = ServiceLifetime.SINGLETON,
        lifetime: ServiceLifetime = ServiceLifetime.SINGLETON,
    ): void {
        this.moduleManager.addModule(moduleClass, factoryOrLifetime, lifetime)
    }

    setValue<T extends Value>(token: Token<T>, value: T): void {
        this.container.registerValue(token, value)
    }

    async start(): Promise<void> {
        bindExitHandler(
            this.stop.bind(this),
            (message) => this.cli.logInfo(message),
            (message) => this.cli.logError(message),
        )

        await this.initializeCLIService()
        await this.moduleManager.loadModules()
        await this.moduleManager.runLifecycleMethods(
            ModuleLifecycleMethod.OnInitialize,
            ModuleLifecycleMethod.OnLoad,
            ModuleLifecycleMethod.OnStart,
        )
        this.isRunning = true
        await this.runMainLoop()
    }

    async pause(): Promise<void> {
        if (this.isRunning && !this.isPaused) {
            await this.moduleManager.runLifecycleMethod(ModuleLifecycleMethod.OnPause)
            this.isPaused = true
        }
    }

    async resume(): Promise<void> {
        if (this.isPaused) {
            await this.moduleManager.runLifecycleMethod(ModuleLifecycleMethod.OnResume)
            this.isPaused = false
            await this.runMainLoop()
        }
    }

    async stop(): Promise<void> {
        this.isRunning = false
        this.isPaused = false
        await this.moduleManager.runLifecycleMethods(
            ModuleLifecycleMethod.OnStop,
            ModuleLifecycleMethod.OnDestroy,
        )
    }

    private async runMainLoop(): Promise<void> {
        let { fps } = this.container.getValue(ServerProperties)
        if (!fps) {
            this.cli.logWarning('FPS not set, defaulting to 24')
            fps = 24
        }
        const frameTime = 1000 / fps
        while (this.isRunning) {
            if (!this.isPaused) {
                await this.moduleManager.runLifecycleMethod(
                    ModuleLifecycleMethod.OnUpdate,
                    [this.tick, 1 / fps],
                )
            }
            this.tick += 1
            await new Promise((resolve) => { setTimeout(resolve, frameTime) })
        }
    }

    private initializeCLI(): Cli {
        const cli = new Cli()
        cli.setLoggerSeverityThreshold(this.container.getValue(ServerProperties).loggerSeverity)
        this.container.registerService(Cli, () => cli, ServiceLifetime.SINGLETON)
        return cli.createChild(CliNamespace.createElement('Server', { fontColor: 'white' }))
    }

    private async initializeCLIService(): Promise<void> {
        if (!this.container.hasService(Cli)) {
            const cli = new Cli()
            cli.setLoggerSeverityThreshold(
                await this.container.resolve(ServerProperties)
                    .then(({ loggerSeverity }) => loggerSeverity),
            )
            this.container.registerService(Cli, () => cli, ServiceLifetime.SINGLETON)
        }
    }

    private configureContainer(properties: Partial<ServerProperties>): void {
        this.container.registerValue(
            ServerProperties,
            new ServerProperties(properties.fps, properties.loggerSeverity),
        )
    }

    private handleAutoResolve({ tags, token }: ServiceDescriptor<object>): void {
        if (!tags.includes('module') && (token as { name: string }).name.endsWith('Module')) {
            this.cli.logWarning(`Tagging auto-resolved ${(token as { name: string }).name} as a module (Reason: '*Module' name schema)`)
            this.container.tagService(token, 'module')
        }

        if (!tags.includes('module') && (token as unknown as { isModule: boolean }).isModule) {
            this.cli.logWarning(`Tagging auto-resolved ${(token as { name: string }).name} as a module (Reason: static isModule property)`)
            this.container.tagService(token, 'module')
        }
    }
}
