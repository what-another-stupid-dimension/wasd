enum ServiceLifetime {
  TRANSIENT,
  SINGLETON,
}

type Token<T> = (new (...args: any[]) => T) | Symbol;

type Value = string | number | boolean | object

type ValueValidator<T extends Value> = (value: T) => boolean

interface ValueDescriptor<T extends Value> {
  token: Token<T>;
  current: T;
  validator?: ValueValidator<T>;
  history: T[];
}

type Service = object

type ServiceFactory<T> = (container: ServiceContainer) => T | Promise<T>

type ServiceClass<T> = new (...args: any[]) => T

type ServiceFactoryOrClass<T> = ServiceFactory<T> | ServiceClass<T>

interface ServiceDescriptor<T extends Service> {
  token: Token<T>;
  lifetime: ServiceLifetime;
  factory: ServiceFactory<T>;
  asyncInit?: boolean;
  parameters?: any[];
  tags: string[];
}

type ServerContainerProperties = {
  onWarning?: (message: string) => void;
  onDebug?: (message: string) => void;
  onAutoResolve?: (service: ServiceDescriptor<Service>) => void;
}

interface ServiceContainer {
  use(middleware: Middleware): void

  registerService<T extends Service>(
      token: Token<T>,
      factoryOrClass: ServiceFactoryOrClass<T>,
      lifetime?: ServiceLifetime,
      parameters?: any[]
  ): void

  registerValue<T extends Value>(
    token: Token<T>,
    value: T,
    validator?: ValueValidator<T>
  ): void

  setValue<T extends Value>(token: Token<T>, value: T): void

  getValue<T extends Value>(token: Token<T>): T

  getValueHistory<T extends Value>(token: Token<T>): T[]

  resolve<T>(token: Token<T>): Promise<T>

  resolveOptional<T>(token: Token<T>): Promise<T | undefined>

  getTaggedServices(tag: string): Promise<any[]>
}

type Middleware = <T>(
  token: Token<T>,
  container: ServiceContainer,
  next: () => Promise<T>
) => Promise<T>;

export {
    Token,
    Value,
    ValueValidator,
    ValueDescriptor,
    Service,
    ServiceLifetime,
    ServiceFactory,
    ServiceClass,
    ServiceFactoryOrClass,
    ServerContainerProperties,
    ServiceContainer,
    ServiceDescriptor,
    Middleware,
}
