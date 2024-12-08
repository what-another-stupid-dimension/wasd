/* eslint-disable no-console */
export default (
    callback: () => Promise<void>,
    log: (message: string) => void = (msg) => console.log(msg),
    error: (message: string) => void = (msg) => console.error(msg),
) => {
    callback = callback || (() => {})

    process.on('SIGINT', () => {
        log('Ctrl-C detected, performing cleanup and exiting...')
        callback()
            .then(() => {
                process.exit(2)
            })
    })

    process.on('uncaughtException', (e) => {
        error(`Uncaught Exception: ${e} ${e.stack}`)
        callback()
            .then(() => {
                process.exit(99)
            })
    })
}
