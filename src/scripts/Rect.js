import Shape from './Shape'

class Rect extends Shape {
  draw (ctx) {
    console.log(this)
    if (this.isFilled) {
      ctx.beginPath()
      ctx.fillStyle = this.color
      ctx.rect(this.x0, this.y0, this.x1, this.y1)
      ctx.fill()
      ctx.closePath()
    } else {
      ctx.strokeStyle = this.color
      ctx.lineWidth = this.width
      ctx.strokeRect(this.x0, this.y0, this.x1, this.y1)
    }
  }
}

export default Rect
