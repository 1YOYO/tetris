const { sin, cos } = Math

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
  const rotateOriginX = rotateOrigin[0]
  const rotateOriginY = rotateOrigin[1]

  return [
    ((x - rotateOriginX) * cos(rotate)) - ((y - rotateOriginY.y) * sin(rotate)) + rotateOriginX,
    ((x - rotateOriginX) * sin(rotate)) + ((y - rotateOriginY.y) * cos(rotate)) + rotateOriginY
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
  console.error(points)
  return points.map(point => rotatePoint(rotate, point, rotateOrigin))
}

const canvas = {
  drawLine,
  rotatePoint,
  rotatePoints
}

export default function (Vue) {
  Vue.prototype.canvas = canvas
}
