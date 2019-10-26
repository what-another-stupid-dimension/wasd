export default class Vector {
  y: number

  x: number

  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  public copy(vector: Vector): Vector {
    this.x = vector.x
    this.y = vector.y

    return this
  }

  public clone(): Vector {
    return new Vector(this.x, this.y)
  }

  public add(vector: Vector): Vector {
    this.x += vector.x
    this.y += vector.y

    return this
  }

  public multiply(factor: number): Vector {
    this.x *= factor
    this.y *= factor

    return this
  }

  public subtract(vector: Vector): Vector {
    this.x -= vector.x
    this.y -= vector.y

    return this
  }

  public scale(scaleX: number, scaleY?: number): Vector {
    this.x *= scaleX
    this.y *= typeof scaleY !== 'undefined' ? scaleY : scaleX

    return this
  }

  public rotate90(): Vector {
    const x: number = -this.y
    const y: number = this.x
    this.x = x
    this.y = y

    return this
  }

  public normalize(): Vector {
    const magnitude: number = this.magnitude()
    this.x /= magnitude
    this.y /= magnitude

    return this
  }

  public magnitude(): number {
    return Math.sqrt(this.magnitudeSq())
  }

  public magnitudeSq(): number {
    return this.x ** 2 + this.y ** 2
  }

  public getAngle(): number {
    return (this.getRadians() * 180) / Math.PI
  }

  public getRadians(): number {
    return Math.atan2(this.x, this.y)
  }

  public dotProduct(vector: Vector): number {
    return this.x * vector.x + this.y * vector.y
  }

  public distanceTo(vector: Vector): number {
    return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2)
  }

  public projectionAxis(target: Vector): Vector {
    const projection: Vector = target.clone()
    const magnitude: number = target.magnitudeSq()

    if (magnitude !== 0) {
      projection.multiply(this.dotProduct(target) / magnitude)
      return projection
    }

    return projection
  }
}
