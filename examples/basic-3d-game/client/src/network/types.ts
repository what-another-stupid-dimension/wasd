export type NetworkContextData = {
    onNetworkEvent: (event: string, callback: (data: any) => void) => void
}
