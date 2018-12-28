import $ from 'jquery'
import Pen from './Pen'
import Line from './Line'
import Rect from './Rect'
import Circle from './Circle'
import Text from './Text'

const TOOL_IDS = {
  ERASOR: 'erasor',
  PEN: 'pen',
  LINE: 'line',
  RECT: 'rect',
  CIRCLE: 'circle',
  TEXT: 'text'
}

const state = {
  shapes: [],
  undoneShapes: [],
  nextToolId: TOOL_IDS.PEN,
  nextColor: 'black',
  nextWidth: 4,
  font: 'Calibri',
  fontSize: '10pt',
  fontInput: 'text',
  isFilled: false,
  isDrawing: false,
  mouse: {
    x: null,
    y: null
  }
}

let canvas
let ctx

function init () {
  // Set up canvas
  canvas = $('#myCanvas')
  ctx = canvas[0].getContext('2d')

  initControls()
  registerEventListeners()
  setInterval(draw, 60)
}

function initControls () {
  $('.selTool').val(state.nextToolId)
  $('.selWidth').val(state.nextWidth)
  $('.colorButton').val(state.nextColor)
  $('#filled').prop('checked', state.isFilled)

  // Text
  $('#font-input').val(state.fontInput)
  $('.font-family').val(state.font)
  $('.font-size').val(state.fontSize)
}

function draw () {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  state.shapes.forEach(shape => shape.draw(ctx))
}

function clearCanvas () {
  state.shapes = []
  state.undoneShapes = []
}

function undo () {
  if (state.shapes.length > 0) {
    state.undoneShapes.push(state.shapes.pop())
  }
}

function redo () {
  if (state.undoneShapes.length > 0) {
    state.shapes.push(state.undoneShapes.pop())
  }
}

function onInputChange (stateProp, eventTargetProp = 'value') {
  return e => {
    state[stateProp] = e.target[eventTargetProp]
  }
}

function onToolInputChange (e) {
  onInputChange('nextToolId')(e)

  if (state.nextToolId === TOOL_IDS.TEXT) {
    $('.text-input').show()
  } else {
    $('.text-input').hide()
  }

  if ((state.nextToolId === TOOL_IDS.RECT) || (state.nextToolId === TOOL_IDS.CIRCLE)) {
    $('.filled-stroked').show()
  } else {
    $('.filled-stroked').hide()
  }

  if ((state.nextToolId === TOOL_IDS.ERASOR)) {
    $('.colorButton').hide()
  } else {
    $('.colorButton').show()
  }
}

function startShapeDraw () {
  const {
    mouse,
    nextToolId,
    shapes,
    nextColor: color,
    nextWidth: width,
    isFilled,
    fontSize,
    font,
    fontInput
  } = state

  const updatedCoordinates = {
    x0: mouse.x,
    y0: mouse.y,
    x1: mouse.x,
    y1: mouse.y
  }

  if (nextToolId === TOOL_IDS.PEN) {
    shapes.push(new Pen({
      ...updatedCoordinates,
      color,
      width
    }))
  } else if (state.nextToolId === TOOL_IDS.LINE) {
    state.shapes.push(new Line({
      ...updatedCoordinates,
      color,
      width
    }))
  } else if (state.nextToolId === TOOL_IDS.RECT) {
    state.shapes.push(new Rect({
      ...updatedCoordinates,
      x1: width,
      y1: width,
      color,
      width,
      isFilled
    }))
  } else if (state.nextToolId === TOOL_IDS.CIRCLE) {
    state.shapes.push(new Circle({
      ...updatedCoordinates,
      color,
      width,
      isFilled
    }))
  } else if (state.nextToolId === TOOL_IDS.TEXT) {
    state.shapes.push(new Text({
      ...updatedCoordinates,
      color,
      fontSize,
      font,
      fontInput
    }))
  } else if (state.nextToolId === TOOL_IDS.ERASOR) {
    state.shapes.push(new Pen({
      ...updatedCoordinates,
      color: 'white',
      width
    }))
  }

  state.isDrawing = true
}

function continueShapeDraw () {
  const { mouse, shapes } = state

  if (state.isDrawing) {
    const shape = shapes[state.shapes.length - 1]

    if (state.nextToolId === TOOL_IDS.PEN || state.nextToolId === TOOL_IDS.ERASOR) {
      shape.addPoint(state.mouse.x, state.mouse.y)
    } else if (state.nextToolId === TOOL_IDS.LINE) {
      shape.x1 = mouse.x
      shape.y1 = mouse.y
    } else if (state.nextToolId === TOOL_IDS.RECT) {
      shape.x1 = mouse.x - shape.x0
      shape.y1 = mouse.y - shape.y0
    } else if (state.nextToolId === TOOL_IDS.CIRCLE) {
      shape.x1 = mouse.x
      shape.y1 = mouse.y
    }
  }
}

function setMouse (x, y) {
  const rect = canvas[0].getBoundingClientRect()
  var documentElement = document.documentElement
  var mouseX = x - rect.left - documentElement.scrollLeft
  var mouseY = y - rect.top - documentElement.scrollTop

  state.mouse.x = mouseX
  state.mouse.y = mouseY
}

function onMouseDown (e) {
  setMouse(e.clientX, e.clientY)
  startShapeDraw()
}

function onMouseMove (e) {
  setMouse(e.clientX, e.clientY)
  continueShapeDraw()
}

function onMouseUp (e) {
  state.isDrawing = false
}

function onMouseLeave (e) {
  state.isDrawing = false
}

function registerEventListeners () {
  // Undo/redo
  $('#clearCanvas').on('click', clearCanvas)
  $('#undo').on('click', undo)
  $('#redo').on('click', redo)

  // Tool inputs
  $('.selTool').on('change', onToolInputChange)
  $('.colorButton').on('change', onInputChange('nextColor'))
  $('.selWidth').on('change', onInputChange('nextWidth'))
  $('.font-family').on('change', onInputChange('font'))
  $('.font-size').on('change', onInputChange('fontSize'))
  $('#font-input').on('change', onInputChange('fontInput'))
  $('#filled').on('change', onInputChange('isFilled', 'checked'))

  // Mouse
  $('#myCanvas')
    .mousedown(onMouseDown)
    .mousemove(onMouseMove)
    .mouseup(onMouseUp)
    .mouseleave(onMouseLeave)
}

$(document).ready(init)
