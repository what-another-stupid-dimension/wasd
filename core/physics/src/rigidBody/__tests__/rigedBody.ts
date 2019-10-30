import MyGameObject, { props } from '../__fixtures__/rigidBodyObject'

test('rigidBody > decorated parameters', () => {
  const testProperty = 'test'
  const instance = new MyGameObject(testProperty)
  expect(instance.testProperty).toBe(testProperty)
  expect(instance.anchor).toBe(props.anchor)
  expect(instance.anchorDistance).toBe(props.anchorDistance)
  expect(instance.collisionShape).toBe(props.collisionShape)
  expect(instance.collisionType).toBe(props.collisionType)
  expect(instance.mass).toBe(props.mass)
  expect(instance.velocity).toBe(props.velocity)
  expect(instance.acceleration).toBe(props.acceleration)
})

test('rigidBody > overwrite decorated parameters', () => {
  const testProperty = 'test'
  const instance = new MyGameObject(testProperty)
  expect(instance.testProperty).toBe(testProperty)
  expect(instance.anchor).toBe(123)
  expect(instance.anchorDistance).toBe(props.anchorDistance)
  expect(instance.collisionShape).toBe(props.collisionShape)
  expect(instance.collisionType).toBe(props.collisionType)
  expect(instance.mass).toBe(props.mass)
  expect(instance.velocity).toBe(props.velocity)
  expect(instance.acceleration).toBe(props.acceleration)
})
