import Shape from './Shape'

class Pen extends Shape {
  constructor (props) {
    super(props)

    this.points = [{
      x: props.x0,
      y: props.y0
    }]
  }

  addPoint (x, y) {
    this.points.push({ x, y })
  }

  draw (ctx) {
    ctx.beginPath()

    ctx.strokeStyle = this.color
    ctx.lineWidth = this.width
    ctx.moveTo(this.points[0].x, this.points[0].y)

    this.points.forEach(function (point) {
      ctx.lineTo(point.x, point.y)
      ctx.moveTo(point.x, point.y)
    })

    ctx.stroke()
  }
}

export default Pen
