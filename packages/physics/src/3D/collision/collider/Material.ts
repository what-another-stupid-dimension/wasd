class Material {
    friction: number

    restitution: number

    constructor(friction: number = 0.5, restitution: number = 0.5) {
        this.friction = friction
        this.restitution = restitution
    }

    serialize(): object {
        return {
            friction: this.friction,
            restitution: this.restitution,
        }
    }
}

export default Material
