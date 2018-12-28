class Shape {
  constructor (props) {
    this.x0 = props.x0 || 0
    this.y0 = props.y0 || 0
    this.x1 = props.x1 || 0
    this.y1 = props.y1 || 0
    this.width = props.width
    this.color = props.color
    this.isFilled = props.isFilled
  }
}

export default Shape
