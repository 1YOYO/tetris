<template>
  <div id="fight">
    <div class="header">
      <div class="left" :style="{width: 'calc(50% - 75px)'}">
        <div class="user-name">JiaMing</div>
        <div class="progress"></div>
        <div class="score">1200</div>
      </div>
      <div class="middle">VS</div>
      <div class="right">
        <div class="user-name">Zhangsan</div>
        <div class="progress"></div>
        <div class="score">890</div>
      </div>
    </div>

    <div class="game-container">
      <div class="left">
        <div class="barrage">
          this is barrage board, deving
        </div>
        <div class="time">
          {{ gameTimer | gameTimerFilter }}
        </div>
      </div>

      <div class="middle">
        <canvas ref="game" class="game"></canvas>
      </div>

      <div class="right">
        <div class="next-tip">
          <canvas ref="next-tip-canvas" class="next-tip-canvas"></canvas>
        </div>
        <div class="current-info">
          <div>Score <span>{{ gameData.score }}</span></div>
          <div>Speed Level <span>{{ gameData.speedLevel }}</span></div>
          <div>View <span>0</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getGameItems from '@/game/getGameItems'

export default {
  name: 'Fight',
  data () {
    return {
      // game canvas ctx
      gameCtx: {},
      // game next tip canvas ctx
      nextTipCtx: {},
      // game canvas width & height
      gameCanvasWH: {
        width: 0,
        height: 0
      },
      // game next tip canvas width & height
      nextTipCanvasWH: {
        width: 0,
        height: 0
      },
      gameGridConfig: {
        verticalNum: 10,
        horizontalNum: 20,
        lineWidth: 1,
        lineColor: '#6ed4d3',
        lineOpacity: 0.4,
        gridWidth: 0,
        gridHeight: 0
      },
      nextTipGridConfig: {
        verticalNum: 12,
        horizontalNum: 10,
        lineWidth: 1,
        lineColor: '#4bb7e4',
        lineOpacity: 0.4,
        gridWidth: 0,
        gridHeight: 0,
        latticeColor: '#4bb7e4',
        latticeOpacity: '0.6',
        showOriginPoints: [
          [3, 3],
          [3, 8],
          [10, 3],
          [10, 8]
        ]
      },
      // game grid data
      gameGridData: [],
      // game next tip grid data
      nextTipGridData: [],
      // game timer
      gameTimer: 0,
      // game config
      gameConfig: {
        // per frame wait time | ms
        frameTime: 30,
        // default origin position
        itemDefaultPos: [5, 1],
        // default down time | ms
        defaultDownTime: 1000,
        // down Increment time
        downIncrement: 100,
        // increment score
        incrementScore: 100
      },
      // game data
      gameData: {
        drawData: [],
        currentItem: null,
        score: 0,
        speedLevel: 1,
        view: 0
      },
      // next tip data
      nextTipData: [],
      // game status
      gameStatus: true,
      // game result
      gameResult: ''
    }
  },
  watch: {
    nextTipData () {
      const { drawNextTip, nextTipData } = this

      drawNextTip()

      nextTipData.length < 5 && nextTipData.push(...getGameItems(100))
    }
  },
  filters: {
    gameTimerFilter (timer) {
      const { trunc } = Math

      const minutes = trunc(timer / 60).toString().padStart(2, '0')
      const seconds = (timer % 60).toString().padStart(2, '0')

      return `${minutes}:${seconds}`
    }
  },
  methods: {
    /**
     * @description             init game
     * @return     {undefined}  no  return
     */
    initGame () {
      const { initGameCanvas, initNextTipCanvas, getGridData, bindKeyDownHandler } = this

      initGameCanvas()
      initNextTipCanvas()

      const { gameCanvasWH, nextTipCanvasWH, gameGridConfig, nextTipGridConfig, gameGridData, nextTipGridData } = this

      getGridData(gameCanvasWH, gameGridConfig, gameGridData)
      getGridData(nextTipCanvasWH, nextTipGridConfig, nextTipGridData)

      const { nextTipData, startGame } = this

      nextTipData.push(...getGameItems(100))

      startGame()

      bindKeyDownHandler()
    },
    /**
     * @description             init game canvas
     * @return     {undefined}  no return
     */
    initGameCanvas () {
      const { $refs, gameCanvasWH } = this

      const canvas = $refs['game']

      this.gameCtx = canvas.getContext('2d')

      let [width, height] = []

      gameCanvasWH.width = width = canvas.clientWidth
      gameCanvasWH.height = height = canvas.clientHeight

      canvas.setAttribute('width', `${width}px`)
      canvas.setAttribute('height', `${height}px`)
    },
    /**
     * @description             init game next tip canvas
     * @return     {undefined}  no return
     */
    initNextTipCanvas () {
      const { $refs, nextTipCanvasWH } = this

      const canvas = $refs['next-tip-canvas']

      this.nextTipCtx = canvas.getContext('2d')

      let [width, height] = []

      nextTipCanvasWH.width = width = canvas.clientWidth
      nextTipCanvasWH.height = height = canvas.clientHeight

      canvas.setAttribute('width', `${width}px`)
      canvas.setAttribute('height', `${height}px`)
    },
    /**
     * @description          get game grid line data
     * @param      {object}  canvas width & height
     * @param      {object}  grid config
     * @param      {array}   store grid data's empty array
     * @return     {Array}   line data
     */
    getGridData (canvasWH, gridConfig, gridDataArray) {
      const { width, height } = canvasWH

      const { verticalNum, horizontalNum, lineWidth } = gridConfig

      const gridWidth = (width - lineWidth * (verticalNum - 1)) / verticalNum
      const gridHeight = (height - lineWidth * (horizontalNum - 1)) / horizontalNum

      gridConfig.gridWidth = gridWidth
      gridConfig.gridHeight = gridHeight

      // vertical line data
      for (let i = 0; i < verticalNum; i++) {
        const widthSpacing = gridWidth * (i + 1) + i * lineWidth

        gridDataArray.push([
          [widthSpacing, 0],
          [widthSpacing, height]
        ])
      }

      // horizontal line data
      for (let i = 0; i < horizontalNum; i++) {
        const heightSpacing = gridHeight * (i + 1) + i * lineWidth

        gridDataArray.push([
          [0, heightSpacing],
          [width, heightSpacing]
        ])
      }
    },
    /**
     * @description             draw grid
     * @param      {object}     canvas ctx
     * @param      {array}      grid line data
     * @param      {object}     grid line config | lineWidth, lineColor, lineOpacity
     * @return     {undefined}  no return
     */
    drawGrid (ctx, gridlineData, gridConfig) {
      const { canvas: { drawLine }, color: { hexToRgb } } = this

      const { lineWidth, lineColor, lineOpacity } = gridConfig

      gridlineData.forEach(line => drawLine(ctx, line[0], line[1], lineWidth, hexToRgb(lineColor, lineOpacity)))
    },
    /**
     * @description             draw game grid
     * @return     {undefined}
     */
    drawGameGrid () {
      const { drawGrid, gameCtx, gameGridData, gameGridConfig } = this

      drawGrid(gameCtx, gameGridData, gameGridConfig)
    },
    /**
     * @description             draw game next tip grid
     * @return     {undefined}
     */
    drawNextTipGrid () {
      const { drawGrid, nextTipCtx, nextTipGridData, nextTipGridConfig } = this

      drawGrid(nextTipCtx, nextTipGridData, nextTipGridConfig)
    },
    /**
     * @description             start game
     * @return     {undefined}  no return
     */
    startGame () {
      const { startGameTimer, setGameCurrentItem, startDownGameCurrentItem, drawGame } = this

      startGameTimer()

      setGameCurrentItem()

      startDownGameCurrentItem()

      drawGame()
    },
    /**
     * @description             start game timer
     * @return     {undefined}  no return
     */
    startGameTimer () {
      const { gameStatus } = this

      if (!gameStatus) return

      this.gameTimer++

      setTimeout(this.startGameTimer, 1000)
    },
    /**
     * @description             draw game
     * @return     {undefined}  no return
     */
    drawGame () {
      const { canvas, gameCtx, gameCanvasWH } = this

      const { clearRect } = canvas

      const { drawGameGrid, drawGameLattices, drawGameCurrentItem, checkGameCurrentItem } = this

      clearRect(gameCtx, gameCanvasWH)

      drawGameGrid()

      drawGameLattices()

      drawGameCurrentItem()

      checkGameCurrentItem()

      const { gameStatus, gameConfig: { frameTime } } = this

      if (!gameStatus) return

      setTimeout(this.drawGame, frameTime)
    },
    /**
     * @description             draw game lattices
     * @return     {undefined}  no return
     */
    drawGameLattices () {
      const { gameCtx, gameData: { drawData }, calcPointLatticePosition, gameGridConfig } = this

      const { deepClone } = this

      const cloneDrawData = deepClone(drawData)

      cloneDrawData.forEach(lattice => (lattice.latticePoints = calcPointLatticePosition(lattice.latticePoints, gameGridConfig)))

      const { canvas: { drawLattice } } = this

      cloneDrawData.forEach(({latticePoints, color}) => drawLattice(gameCtx, latticePoints, color))
    },
    /**
     * @description             set game current item
     * @return     {undefined}  no return
     */
    setGameCurrentItem () {
      let { gameData, gameData: { currentItem }, nextTipData } = this

      if (currentItem) return

      gameData.currentItem = currentItem = nextTipData.shift()

      const { gameConfig: { itemDefaultPos } } = this

      const { calcPointsTruePositionWithOrigin, deepClone } = this

      currentItem.origin = deepClone(itemDefaultPos)

      currentItem.points = calcPointsTruePositionWithOrigin(currentItem.points, itemDefaultPos)

      let lowestYPos = 1

      currentItem.points.forEach(([, y]) => (y > lowestYPos && (lowestYPos = y)))

      currentItem.points.forEach(point => (point[1] -= lowestYPos))

      currentItem.origin[1] -= lowestYPos
    },
    /**
     * @description             start down game currtent item
     * @return     {undefined}  no return
     */
    startDownGameCurrentItem () {
      const { gameStatus, gameData: { currentItem, speedLevel }, gameConfig } = this

      if (!gameStatus) return

      const { checkDirectionMoveAble, freezeItem, setGameCurrentItem } = this

      if (checkDirectionMoveAble('down')) {
        currentItem.points.map(point => (point[1] += 1))
        currentItem.origin[1] += 1
      } else {
        freezeItem()
        setGameCurrentItem()
      }

      const { defaultDownTime, downIncrement } = gameConfig

      setTimeout(this.startDownGameCurrentItem, defaultDownTime - ((speedLevel - 1) * downIncrement))
    },
    /**
     * @description             draw game current itme
     * @return     {undefined}  no return
     */
    drawGameCurrentItem () {
      const { gameCtx, gameData: { currentItem }, gameGridConfig } = this

      const { drawGameItem, calcPointsLatticePosition, deepClone } = this

      const cloneCurrentItem = deepClone(currentItem)

      cloneCurrentItem.points = calcPointsLatticePosition(cloneCurrentItem.points, gameGridConfig)

      drawGameItem(gameCtx, cloneCurrentItem)
    },
    /**
     * @description             check game current itme is activeable
     * @return     {undefined}  no return
     */
    checkGameCurrentItem () {
    },
    /**
     * @description             draw game next tip
     * @return     {undefined}  no return
     */
    drawNextTip () {
      const { canvas, nextTipCtx, nextTipCanvasWH, nextTipGridData, nextTipGridConfig } = this

      const { clearRect } = canvas

      const { drawGrid, drawAllNextTipItem } = this

      clearRect(nextTipCtx, nextTipCanvasWH)

      drawGrid(nextTipCtx, nextTipGridData, nextTipGridConfig)

      drawAllNextTipItem()
    },
    /**
     * @description             draw all next tip item
     * @return     {undefined}  no return
     */
    drawAllNextTipItem () {
      const { nextTipData, nextTipGridConfig, nextTipCtx } = this

      const { deepClone, calcPointsTruePositionWithOrigin, calcPointsLatticePosition, drawGameItems } = this

      const showNextTipItems = deepClone(nextTipData.slice(0, 4))

      const { showOriginPoints } = nextTipGridConfig

      showNextTipItems.forEach((item, index) => (item.points = calcPointsTruePositionWithOrigin(item.points, showOriginPoints[index])))

      showNextTipItems.forEach(item => (item.points = calcPointsLatticePosition(item.points, nextTipGridConfig)))

      drawGameItems(nextTipCtx, showNextTipItems)
    },
    /**
     * @description             draw game items
     * @return     {undefined}  no return
     */
    drawGameItems (ctx, items) {
      const { drawGameItem } = this

      items.forEach(item => drawGameItem(ctx, item))
    },
    /**
     * @description             draw game item
     * @return     {undefined}  no return
     */
    drawGameItem (ctx, {points, color, opacity}) {
      const { color: { hexToRgb }, canvas: { drawLattices } } = this

      drawLattices(ctx, points, hexToRgb(color, opacity))
    },
    /**
     * @description         calc point true position with origin
     * @return     {array}  true position
     */
    calcPointTruePositionWithOrigin ([x, y], [oX, oY]) {
      return [x + oX, y + oY]
    },
    /**
     * @description         calc points true position with origin
     * @return     {array}  true position
     */
    calcPointsTruePositionWithOrigin (points, originPoint) {
      const { calcPointTruePositionWithOrigin } = this

      return points.map(point => calcPointTruePositionWithOrigin(point, originPoint))
    },
    /**
     * @description         calc point lattice draw position
     * @return     {array}  lattice draw position
     */
    calcPointLatticePosition ([x, y], { lineWidth, gridWidth, gridHeight }) {
      const latticeWidth = gridWidth + lineWidth
      const latticeHeight = gridHeight + lineWidth

      const [beginX, beginY] = [x - 1, y - 1]

      return [
        [latticeWidth * beginX, latticeHeight * beginY],
        [latticeWidth * x - lineWidth, latticeHeight * beginY],
        [latticeWidth * x - lineWidth, latticeHeight * y - lineWidth],
        [latticeWidth * beginX, latticeHeight * y - lineWidth]
      ]
    },
    /**
     * @description         calc points lattice draw position
     * @return     {array}  lattice draw position
     */
    calcPointsLatticePosition (points, gridConfig) {
      const { calcPointLatticePosition } = this

      return points.map(point => calcPointLatticePosition(point, gridConfig))
    },
    /**
     * @description             bind key down handler
     * @return     {undefined}  no return
     */
    bindKeyDownHandler () {
      const { moveItem } = this

      document.addEventListener('keydown', ({keyCode}) => {
        switch (keyCode) {
          case 37: moveItem('left')
            break
          case 39: moveItem('right')
            break
          case 38: moveItem('rotate')
            break
          case 40: moveItem('down')
            break
        }
      })
    },
    /**
     * @description             move game item
     * @return     {undefined}  no return
     */
    moveItem (direction) {
      const { checkDirectionMoveAble, calcPointsTruePositionWithOrigin } = this

      if (!checkDirectionMoveAble(direction)) return

      const { gameData: { currentItem }, rotateItem } = this

      if (direction === 'left') {
        currentItem.points = calcPointsTruePositionWithOrigin(currentItem.points, [-1, 0])
        currentItem.origin[0] -= 1
      }

      if (direction === 'right') {
        currentItem.points = calcPointsTruePositionWithOrigin(currentItem.points, [1, 0])
        currentItem.origin[0] += 1
      }

      if (direction === 'rotate') rotateItem()

      if (direction === 'down') {
        currentItem.points = calcPointsTruePositionWithOrigin(currentItem.points, [0, 1])
        currentItem.origin[1] += 1
      }
    },
    /**
     * @description           check game item direction move able
     * @return     {boolean}  move able status
     */
    checkDirectionMoveAble (direction) {
      const { gameData: { drawData, currentItem }, gameGridConfig: { verticalNum, horizontalNum } } = this

      const { deepClone, rotateItem } = this

      let cloneCurrentItem = deepClone(currentItem)

      let status = true

      if (direction === 'left') {
        cloneCurrentItem.points.forEach(point => (point[0] -= 1))
        cloneCurrentItem.points.forEach(point => (point[0] < 1 && (status = false)))
        if (!status) return false
      }

      if (direction === 'right') {
        cloneCurrentItem.points.forEach(point => (point[0] += 1))
        cloneCurrentItem.points.forEach(point => (point[0] > verticalNum && (status = false)))
        if (!status) return false
      }

      if (direction === 'down') {
        cloneCurrentItem.points.forEach(point => (point[1] += 1))
        cloneCurrentItem.points.forEach(point => (point[1] > horizontalNum && (status = false)))
        if (!status) return false
      }

      if (direction === 'rotate') {
        cloneCurrentItem = rotateItem(cloneCurrentItem)

        cloneCurrentItem.points.forEach(point => ((point[0] > verticalNum || point[0] < 1) && (status = false)))
        if (!status) return false
        cloneCurrentItem.points.forEach(point => (point[1] > horizontalNum && (status = false)))
        if (!status) return false
      }

      const twoBitPointsPosDrawData = drawData.map(({latticePoints: [x, y]}) => ([(x + '').padStart(2, '0'), (y + '').padStart(2, '0')]))
      const twoBitPointsCurrentItem = cloneCurrentItem.points.map(([x, y]) => ([(x + '').padStart(2, '0'), (y + '').padStart(2, '0')]))

      const drawDataString = twoBitPointsPosDrawData.map(point => point.toString()).join('-')
      const currentItemPointsString = twoBitPointsCurrentItem.map(points => points.toString())

      currentItemPointsString.forEach(point => (drawDataString.indexOf(point) !== -1 && (status = false)))

      return status
    },
    /**
     * @description             freeze item
     * @return     {undefined}  no return
     */
    freezeItem () {
      const { gameData, gameData: { drawData, currentItem: { points, color: hex, opacity } } } = this

      const { color: { hexToRgb }, deepClone } = this

      const color = hexToRgb(hex, opacity)

      const clonePoints = deepClone(points)

      drawData.push(...clonePoints.map(point => ({ latticePoints: point, color })))

      gameData.currentItem = null
    },
    /**
     * @description             rotate game item
     * @return     {undefined}  no return
     */
    rotateItem (item) {
      let { gameData: { currentItem } } = this

      const rotateItem = item || currentItem

      let { points, origin, rotateAble } = rotateItem

      if (!rotateAble) return

      rotateItem.rotate += 90

      rotateItem.rotate === 360 && (rotateItem.rotate = 0)

      const { canvas: { rotatePoints } } = this

      rotateItem.points = rotatePoints(rotateItem.rotate, points, origin)

      return rotateItem
    }
  },
  mounted () {
    const { initGame } = this

    initGame()
  }
}
</script>

<style lang="less">
@import '../../assets/style/color.less';
@import '../../assets/style/class.less';

#fight {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    width: 100%;
    height: 80px;
    display: flex;
    flex-direction: row;

    .middle {
      width: 150px;
      font-size: 80px;
      line-height: 80px;
      text-align: center;
      .text-shadow-big-animation;
    }

    .right {
      flex: 1;

      .user-name, .score {
        text-align: right;
        margin-left: 0px;
        margin-right: 20px;
        .text-shadow-small(@addi-color);
      }

      .progress {
        background-color: @addi-color;
        box-shadow: 0 0 3px @addi-color;
      }
    }

    .user-name, .score {
      height: 30px;
      font-size: 20px;
      margin-left: 20px;
      line-height: 30px;
      .text-shadow-small(@deep-color);
    }

    .progress {
      height: 20px;
      background-color: @deep-color;
      border-radius: 5px;
      box-shadow: 0 0 3px @deep-color;
    }
  }

  .game-container {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: row;
    min-height: 800px;

    .left, .right {
      flex: 1;
      margin: auto;
    }

    .left {
      .barrage, .time {
        box-sizing: border-box;
        margin-right: 10px;
        box-shadow: 0 0 3px @deep-color;
      }

      .barrage {
        margin-bottom: 10px;
        height: 400px;
      }

      .time {
        height: 390px;
        font-size: 100px;
        line-height: 390px;
        text-align: center;
        .text-shadow-big;
      }
    }

    .right {
      .next-tip, .current-info {
        box-sizing: border-box;
        margin-left: 10px;
        box-shadow: 0 0 3px @addi-color;
      }

      .next-tip {
        margin-bottom: 10px;
        overflow: hidden;
        height: 400px;

        .next-tip-canvas {
          width: 100%;
          height: 100%;
          box-shadow: 0 0 3px @addi-color;
        }
      }

      .current-info {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        overflow: hidden;
        font-size: 40px;
        height: 390px;

        div {
          height: 80px;
          line-height: 80px;
          text-indent: 20px;
          .text-shadow-small(@addi-color);
          box-shadow: 0 0 3px @addi-color;

          span {
            float: right;
            margin-right: 20px;
          }
        }
      }
    }

    .middle {
      width: 400px;

      .game {
        position: absolute;
        width: 400px;
        height: 800px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 3px @main-color;
      }
    }
  }
}
</style>
