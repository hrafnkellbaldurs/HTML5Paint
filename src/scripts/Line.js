import Shape from './Shape'

class Line extends Shape {
  draw (ctx) {
    ctx.beginPath()
    ctx.strokeStyle = this.color
    ctx.lineWidth = this.width
    ctx.lineCap = 'round'
    ctx.moveTo(this.x0, this.y0)
    ctx.lineTo(this.x1, this.y1)
    ctx.stroke()
  }
}

export default Line
