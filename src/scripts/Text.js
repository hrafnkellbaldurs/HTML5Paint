import Shape from './Shape'

class Text extends Shape {
  constructor (props) {
    super(props)

    this.font = props.font || 'Calibri'
    this.fontSize = props.fontSize || '10pt'
    this.fontInput = props.fontInput
  }

  draw (ctx) {
    ctx.font = `${this.fontSize} ${this.font}`
    ctx.fillStyle = this.color
    ctx.fillText(this.fontInput, this.x0, this.y0)
  }
}

export default Text
