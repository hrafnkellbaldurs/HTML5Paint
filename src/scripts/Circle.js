import Shape from './Shape'

class Circle extends Shape {
  draw (ctx) {
    ctx.beginPath()
    ctx.moveTo(this.x0, this.y0 + (this.y1 - this.y0) / 2)
    ctx.bezierCurveTo(this.x0, this.y0, this.x1, this.y0, this.x1, this.y0 + (this.y1 - this.y0) / 2)
    ctx.bezierCurveTo(this.x1, this.y1, this.x0, this.y1, this.x0, this.y0 + (this.y1 - this.y0) / 2)
    ctx.closePath()

    if (this.isFilled) {
      ctx.fillStyle = this.color
      ctx.fill()
    } else {
      ctx.strokeStyle = this.color
      ctx.lineWidth = this.width
      ctx.stroke()
    }
  }
}

export default Circle
