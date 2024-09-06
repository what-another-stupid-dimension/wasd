import 'reflect-metadata'
import { InjectedService } from './types'
import { INJECT_METADATA_KEY } from './constants'

export default (token: any, optional: boolean = false): ParameterDecorator => (
    target: Object,
    propertyKey: any,
    parameterIndex: number,
): void => {
    const existingInjectedTokens: Array<InjectedService> = Reflect.getMetadata(
        INJECT_METADATA_KEY,
        target,
    ) || []

    // Add the token and parameter index to the metadata
    existingInjectedTokens
        .push({ token, index: parameterIndex || 0, optional })

    existingInjectedTokens
        .sort((tokenA: InjectedService, tokenB: InjectedService) => tokenA.index - tokenB.index)

    // Store the updated metadata back to the target
    Reflect.defineMetadata(INJECT_METADATA_KEY, existingInjectedTokens, target)
}
