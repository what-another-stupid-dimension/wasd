export default (name: string): HelloWorldInterface => ({
  string: `Hello ${name}!`
})

interface HelloWorldInterface {
  string: string
}
