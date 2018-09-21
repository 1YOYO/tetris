import gameItems from './gameItems'

import { rotatePoints } from '../plugins/canvasExtend'

const allItemsNum = gameItems.length

const { random, trunc } = Math

function getArrayRandomIndex (length) {
  return trunc(random() * length)
}

export default function (itemNum = 1) {
  const items = []

  for (let i = 0; i < itemNum; i++) {
    const randomItem = JSON.parse(JSON.stringify(gameItems[getArrayRandomIndex(allItemsNum)]))

    if (randomItem.rotateAble) randomItem.rotate = 90 * getArrayRandomIndex(4)

    randomItem.points = rotatePoints(randomItem.rotate, randomItem.points)

    items.push(randomItem)
  }

  return items
}
