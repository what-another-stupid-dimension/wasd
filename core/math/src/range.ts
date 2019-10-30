export default class Range {
  min: number

  max: number

  constructor(min: number, max: number) {
    this.min = min
    this.max = max
  }

  isOverlapping(range: Range): boolean {
    return range.max >= this.min && this.max >= range.min
  }
}
