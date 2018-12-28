import $ from 'jquery'

$(document).ready(function () {
  const canvas = $('#myCanvas')
  const c = canvas[0].getContext('2d')
  let isDrawing = false
  $('.text-input').hide()
  $('.filled-stroked').hide()

  const drawing = {
    shapes: [],
    nextObject: 'pen',
    nextColor: 'black',
    nextWidht: 4,
    font: 'Calibri',
    fontSize: '10pt',
    fontInput: ' ',
    currentInputbox: 0,
    isFilled: false
  }

  const redo = {
    shapes: []
  }

  function drawAll () {
    c.clearRect(0, 0, c.canvas.width, c.canvas.height)

    drawing.shapes.forEach(function (shape) {
      shape.draw()
    })
  }

  // clear canvas
  $('#clearCanvas').on('click', function (e) {
    redo.shapes = []
    drawing.shapes = []
  })

  $('#undo').on('click', function (e) {
    if (drawing.shapes.length > 0) {
      redo.shapes.push(drawing.shapes.pop())
    };
  })

  $('#redo').on('click', function (e) {
    if (redo.shapes.length > 0) {
      drawing.shapes.push(redo.shapes.pop())
    };
  })

  $('.selTool').on('change', function (e) {
    drawing.nextObject = $(this).val()
    if ($(this).val() === 'text') {
      $('.text-input').show()
    } else {
      $('.text-input').hide()
    }

    if (($(this).val() === 'rect') || ($(this).val() === 'circle')) {
      $('.filled-stroked').show()
    } else {
      $('.filled-stroked').hide()
    }

    if (($(this).val() === 'erasor')) {
      $('.colorButton').hide()
      $('.selWidth').hide()
    } else {
      $('.colorButton').show()
      $('.selWidth').show()
    }
  })

  $('.colorButton').on('change', function (e) {
    drawing.nextColor = $(this).val()
  })

  $('.selWidth').on('change', function (e) {
    drawing.nextWidht = $(this).val()
  })

  $('.font-style').on('change', function (e) {
    drawing.font = $(this).val()
  })

  $('.font-size').on('change', function (e) {
    drawing.fontSize = $(this).val()
  })

  $('#font-input').on('change', function (e) {
    drawing.fontInput = $(this).val()
  })

  $('.filled').on('change', function (e) {
    if (drawing.isFilled === true) {
      drawing.isFilled = false
    } else {
      drawing.isFilled = true
    }
  })

  $('#myCanvas').mousedown(function (e) {
    if (drawing.nextObject === 'pen') {
      drawing.shapes.push(new Pen(
        drawing.nextColor,
        drawing.nextWidht,
        e.pageX - this.offsetLeft,
        e.pageY - this.offsetTop
      ))
    } else if (drawing.nextObject === 'line') {
      drawing.shapes.push(new Line(
        drawing.nextColor,
        drawing.nextWidht,
        e.pageX - this.offsetLeft,
        e.pageY - this.offsetTop,
        e.pageX - this.offsetLeft,
        e.pageY - this.offsetTop
      ))
    } else if (drawing.nextObject === 'rect') {
      drawing.shapes.push(new Rect(
        drawing.nextColor,
        drawing.nextWidht,
        e.pageX - this.offsetLeft,
        e.pageY - this.offsetTop,
        e.pageX - this.offsetLeft,
        e.pageY - this.offsetTop,
        drawing.isFilled
      ))
    } else if (drawing.nextObject === 'circle') {
      drawing.shapes.push(new Circle(
        drawing.nextColor,
        drawing.nextWidht,
        e.pageX - this.offsetLeft,
        e.pageY - this.offsetTop,
        e.pageX - this.offsetLeft,
        e.pageY - this.offsetTop,
        drawing.isFilled
      ))
    } else if (drawing.nextObject === 'text') {
      drawing.shapes.push(new Text(
        drawing.nextColor,
        drawing.fontSize + ' ' + drawing.font,
        drawing.fontInput,
        e.pageX - this.offsetLeft,
        e.pageY - this.offsetTop
      ))
    } else if (drawing.nextObject === 'erasor') {
      drawing.shapes.push(new Pen(
        'white',
        20,
        e.pageX - this.offsetLeft,
        e.pageY - this.offsetTop
      ))
    }

    isDrawing = true
  })

  $('#myCanvas').mousemove(function (e) {
    const l = drawing.shapes[drawing.shapes.length - 1]

    if (isDrawing && drawing.nextObject === 'pen') {
      l.addPoint(e.pageX - this.offsetLeft, e.pageY - this.offsetTop)
    } else if (isDrawing && drawing.nextObject === 'line') {
      l.x1 = e.pageX - $(this).offset().left
      l.y1 = e.pageY - $(this).offset().top
    } else if (isDrawing && drawing.nextObject === 'rect') {
      l.x1 = e.pageX - $(this).offset().left - l.x0
      l.y1 = e.pageY - $(this).offset().top - l.y0
    } else if (isDrawing && drawing.nextObject === 'circle') {
      l.x1 = e.pageX - $(this).offset().left
      l.y1 = e.pageY - $(this).offset().top
    } else if (isDrawing && drawing.nextObject === 'erasor') {
      l.addPoint(e.pageX - this.offsetLeft, e.pageY - this.offsetTop)
    }
  })

  $('#myCanvas').mouseup(function (e) {
    isDrawing = false
  })

  $('#myCanvas').mouseleave(function (e) {
    isDrawing = false
  })

  function Shape (color, thickness, x0, y0, x1, y1, font, fontInput, isFilled) {
    this.x0 = x0 || 0
    this.y0 = y0 || 0
    this.x1 = x1 || 0
    this.y1 = y1 || 0
    this.thickness = thickness
    this.color = color
    this.font = font || '10pt Calibri'
    this.fontInput = fontInput
    this.isFilled = isFilled
  }

  // ********* PEN *********
  function Pen (color, thickness, x0, y0) {
    Shape.call(this, color, thickness, x0, y0)
    this.points = [{
      x: x0,
      y: y0
    }]
  }

  Pen.prototype = new Shape()

  Pen.prototype.addPoint = function (x, y) {
    this.points.push({
      x: x,
      y: y
    })
  }

  Pen.prototype.draw = function () {
    c.beginPath()

    c.strokeStyle = this.color
    c.lineWidth = this.thickness
    c.moveTo(this.points[0].x, this.points[0].y)

    this.points.forEach(function (point) {
      c.lineTo(point.x, point.y)
      c.moveTo(point.x, point.y)
    })
    c.stroke()
  }

  // ********* LINE *********
  function Line (color, thickness, x0, y0, x1, y1) {
    Shape.call(this, color, thickness, x0, y0, x1, y1)
  }

  Line.prototype = new Shape()

  Line.prototype.draw = function () {
    c.beginPath()
    c.strokeStyle = this.color
    c.lineWidth = this.thickness
    c.lineCap = 'round'
    c.moveTo(this.x0, this.y0)
    c.lineTo(this.x1, this.y1)
    c.stroke()
  }

  // ********* RECT *********
  function Rect (color, thickness, x0, y0, x1, y1, isFilled) {
    Shape.call(this, color, thickness, x0, y0, x1, y1, 0, 0, isFilled)
  }

  Rect.prototype = new Shape()

  Rect.prototype.draw = function () {
    if (this.isFilled) {
      c.beginPath()
      c.fillStyle = this.color
      c.rect(this.x0, this.y0, this.x1, this.y1)
      c.fill()
      c.closePath()
    } else {
      c.strokeStyle = this.color
      c.lineWidth = this.thickness
      c.strokeRect(this.x0, this.y0, this.x1, this.y1)
    }
  }

  // ********* CIRCLE *********
  function Circle (color, thickness, x0, y0, x1, y1, isFilled) {
    Shape.call(this, color, thickness, x0, y0, x1, y1, 0, 0, isFilled)
  }

  Circle.prototype = new Shape()

  Circle.prototype.draw = function () {
    c.beginPath()
    c.moveTo(this.x0, this.y0 + (this.y1 - this.y0) / 2)
    c.bezierCurveTo(this.x0, this.y0, this.x1, this.y0, this.x1, this.y0 + (this.y1 - this.y0) / 2)
    c.bezierCurveTo(this.x1, this.y1, this.x0, this.y1, this.x0, this.y0 + (this.y1 - this.y0) / 2)
    c.closePath()

    if (this.isFilled) {
      c.fillStyle = this.color
      c.fill()
    } else {
      c.strokeStyle = this.color
      c.lineWidth = this.thickness
      c.stroke()
    }
  }

  // ********* TEXT *********
  function Text (color, fontProp, fontInput, x, y) {
    Shape.call(this, color, 0, x, y, 0, 0, fontProp, fontInput, 0)
  }

  Text.prototype = new Shape()

  Text.prototype.draw = function () {
    c.font = this.font
    c.fillStyle = this.color
    c.fillText(this.fontInput, this.x0, this.y0)
  }

  setInterval(drawAll, 60)
})
