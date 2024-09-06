import Inject from './Inject'

export default (token: any): ParameterDecorator => (
    target: Object,
    propertyKey: any,
    parameterIndex: number,
): void => Inject(token, true)(target, propertyKey, parameterIndex)
