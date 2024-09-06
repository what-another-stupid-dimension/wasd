export enum ModulePriority {
    OPTIONAL = 0,
    LOW = 1,
    CUSTOM = 8,
    MEDIUM = 16,
    INTERNAL = 32,
    HEIGH = 48,
    CORE = 64,
}

export enum ModuleLifecycleMethod {
    OnInitialize = 'onInitialize',
    OnLoad = 'onLoad',
    OnStart = 'onStart',
    OnUpdate = 'onUpdate',
    OnResume = 'onResume',
    OnPause = 'onPause',
    OnStop = 'onStop',
    OnDestroy = 'onDestroy',
    OnRestart = 'onRestart',
}

export interface Module {
    priority?: ModulePriority | number;

    /**
     * - Called once when the server starts up, before `onStart`.
     * - Use this to load configuration files, initialize basic data structures, or set up necessary preconditions.
     */
    onInitialize?(): Promise<void> | void;

    /**
     * - Called after `onInitialize` but before `onStart`.
     * - Useful for loading resources or dependencies that modules might need to operate (like database connections or external service clients).
     */
    onLoad?(): Promise<void> | void;

    /**
     * Typically, you’d use this to start module-specific processes or tasks. It’s also a good place to register event listeners or begin any main logic for each module.
     */
    onStart?(): Promise<void> | void;

    /**
     * - Called repeatedly during the server’s main update loop (at a specified interval or on every frame).
     * - Use this to handle regular updates, time-dependent calculations, or checks within each module. This is particularly useful for game logic, physics updates, or other operations that require continuous processing.
     */
    onUpdate?(tick: number, deltaTime: number): Promise<void> | void;

    /**
     * - Invoked when a module needs to resume from a paused state, such as after maintenance.
     * - Can reinitialize or resume tasks, timers, or subscriptions that were paused.
     */
    onResume?(): Promise<void> | void;

    /**
     * - Used to temporarily pause operations without fully shutting down the server.
     * - You can use this to pause tasks or processing in a module without destroying state or disconnecting resources.
     */
    onPause?(): Promise<void> | void;

    /**
     * - Called before `onDestroy` when the server stops but before resources are fully released.
     * - Useful for saving states, finishing any active processing, or logging statistics.
     */
    onStop?(): Promise<void> | void;

    /**
     * - Handles resource cleanup, releasing resources like memory, connections, or files.
     * - Typically called in reverse order of onStart.
     */
    onDestroy?(): Promise<void> | void;

    /**
     * - Called if a module needs to be restarted (e.g., in response to an error or update).
     * - Can invoke `onStop` and `onStart` internally or reset specific internal states.
     */
    onRestart?(): Promise<void> | void;
}

export type ModuleConstructor<T extends Module> = {
    new (...args: any[]): T;
    isModule?: boolean;
};

export type ModuleFactory<T extends Module> = () => T;
