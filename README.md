![https://avatars2.githubusercontent.com/u/56599205?s=128&v=4](https://avatars2.githubusercontent.com/u/56599205?s=128&v=4)
# What another stupid Dimension

Open Source Game and Physics Engine

## Features (Work in Progress)

- Game Framework
- Game Client Framework
- Game Server Framework
- Server / Client Communication (TCP)
- Physics Engine
- Entities
- Spells
- Inventories
- Combat
- Map System
- Procedural Map Generator
- Map Builder

## Development

### Prerequisites

To start development on wasd you need:

- node
- yarn

### Tests

We are using Jest for testing. Run `yarn run test` for tests.  
This command is also available in every sub-package. `cd core/physics && yarn run test`

### Linting

For linting we are using eslint + prettier.
Make sure to setup your IDE to run with prettier.
`yarn run lint`

Or with fix flag:

`yarn run lint:fix`

### Build Packages

To guaranty a fresh build run `yarn run clean` before you run the building `yarn run build` command.