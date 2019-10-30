import Vector from '../vector'

test('geometry > vector > copy', () => {
  const vector = new Vector(10, 20)
  vector.copy(new Vector(20, 30))
  expect(vector.x).toBe(20)
  expect(vector.y).toBe(30)
})

test('geometry > vector > clone', () => {
  const vector = new Vector(10, 20)
  const clonedVector = vector.clone()

  expect(vector === clonedVector).toBe(false)
  expect(vector.x).toBe(clonedVector.x)
  expect(vector.y).toBe(clonedVector.y)
})

test('geometry > vector > add', () => {
  const vector = new Vector(10, 20)
  vector.add(new Vector(10, 10))

  expect(vector.x).toBe(20)
  expect(vector.y).toBe(30)
})

test('geometry > vector > multiply', () => {
  const vector = new Vector(10, 20)
  vector.multiply(2.5)

  expect(vector.x).toBe(25)
  expect(vector.y).toBe(50)
})

test('geometry > vector > subtract', () => {
  const vector = new Vector(10, 20)
  vector.subtract(new Vector(10, 10))

  expect(vector.x).toBe(0)
  expect(vector.y).toBe(10)
})

test('geometry > vector > scale with one parameter', () => {
  const vector = new Vector(10, 20)
  vector.scale(10)

  expect(vector.x).toBe(100)
  expect(vector.y).toBe(200)
})

test('geometry > vector > scale with x and y parameter', () => {
  const vector = new Vector(10, 20)
  vector.scale(10, 100)

  expect(vector.x).toBe(100)
  expect(vector.y).toBe(2000)
})

test('geometry > vector > rotate90', () => {
  const vector = new Vector(10, 20)
  vector.rotate90()

  expect(vector.x).toBe(-20)
  expect(vector.y).toBe(10)
})

test('geometry > vector > normalize', () => {
  const vector = new Vector(10, 20)
  vector.normalize()

  expect(vector.x).toBe(0.4472135954999579)
  expect(vector.y).toBe(0.8944271909999159)
})

test('geometry > vector > magnitude', () => {
  const vector = new Vector(10, 20)
  expect(vector.magnitude()).toBe(22.360679774997898)
})

test('geometry > vector > magnitudeSq', () => {
  const vector = new Vector(10, 20)
  expect(vector.magnitudeSq()).toBe(500)
})

test('geometry > vector > getAngle', () => {
  const vector = new Vector(10, 10)
  expect(vector.getAngle()).toBe(45)
})

test('geometry > vector > getRadians', () => {
  const vector = new Vector(10, 10)
  expect(vector.getRadians()).toBe(0.7853981633974483)
})

test('geometry > vector > dotProduct', () => {
  const vector = new Vector(10, 10)
  expect(vector.dotProduct(new Vector(20, 20))).toBe(400)
})

test('geometry > vector > distanceTo', () => {
  const vector = new Vector(10, 10)
  expect(vector.distanceTo(new Vector(10, 20))).toBe(10)
  expect(vector.distanceTo(new Vector(20, 20))).toBe(14.142135623730951)
})

test('geometry > vector > projectionAxis', () => {
  const vector = new Vector(10, 10)
  const projection = vector.projectionAxis(new Vector(20, 20))
  expect(projection.x).toBe(10)
  expect(projection.y).toBe(10)
})

test('geometry > vector > projectionAxis with zero case', () => {
  const vector = new Vector(0, 0)
  const projection = vector.projectionAxis(new Vector(0, 0))
  expect(projection.x).toBe(0)
  expect(projection.y).toBe(0)
})
