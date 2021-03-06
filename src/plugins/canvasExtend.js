const { sin, cos } = Math

/**
 * @description             clear rect
 * @return     {undefined}  no return
 */
export function clearRect (ctx, { width, height }) {
  ctx.clearRect(0, 0, width, height)
}

/**
 * @description      draw line
 * @param  {object}  ctx
 * @param  {object}  lineBegin
 * @param  {object}  lineEnd
 * @param  {int}     lineWidth
 * @param  {string}  lineColor
 */
export function drawLine (ctx, lineBegin, lineEnd, lineWidth = 2, lineColor = '#000') {
  if (!ctx || !lineBegin || !lineEnd) return

  ctx.beginPath()

  ctx.moveTo(...lineBegin)
  ctx.lineTo(...lineEnd)

  ctx.closePath()

  ctx.lineWidth = lineWidth
  ctx.strokeStyle = lineColor

  ctx.stroke()
}

/**
 * @description     rotate point's position with rotateOrigin, if rotate more than 0, Clockwise rotate
 * @param {int}     rotate angle
 *
 * @param {int}     point's x position
 * @param {int}     point's y position
 *
 * @param {array}   rotateOrigin position
 */
export function rotatePoint (rotate, [x, y], rotateOrigin = [0, 0]) {
  rotate *= Math.PI / 180

  const rotateOriginX = rotateOrigin[0]
  const rotateOriginY = rotateOrigin[1]

  return [
    ((x - rotateOriginX) * cos(rotate)) - ((y - rotateOriginY) * sin(rotate)) + rotateOriginX,
    ((x - rotateOriginX) * sin(rotate)) + ((y - rotateOriginY) * cos(rotate)) + rotateOriginY
  ]
}

/**
 * @description         rotate points
 * @param      {int}    rotate angle
 * @param      {array}  points [[x, y], ...]
 *
 * @param {array}   rotateOrigin position
 */
export function rotatePoints (rotate, points, rotateOrigin = [0, 0]) {
  return points.map(point => rotatePoint(rotate, point, rotateOrigin))
}

/**
 * @description             draw lattice
 * @param      {object}     canvas ctx
 * @param      {array}      lattice draw data
 * @param      {object}     lattice color
 * @return     {undefined}
 */
export function drawLattice (ctx, [one, two, three, four], color) {
  ctx.beginPath()

  ctx.moveTo(...one)
  ctx.lineTo(...two)
  ctx.lineTo(...three)
  ctx.lineTo(...four)

  ctx.closePath()

  ctx.strokeStyle = color
  ctx.fillStyle = color

  ctx.fill()
  ctx.stroke()
}

/**
 * @description             draw lattices
 * @param      {object}     canvas ctx
 * @param      {array}      lattice draw data
 * @param      {object}     lattice color
 * @return     {undefined}
 */
export function drawLattices (ctx, lattices, color) {
  lattices.forEach(lattice => drawLattice(ctx, lattice, color))
}

const canvas = {
  clearRect,
  drawLine,
  rotatePoint,
  rotatePoints,
  drawLattice,
  drawLattices
}

export default function (Vue) {
  Vue.prototype.canvas = canvas
}
