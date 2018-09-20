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
          00:06
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
          <div>Score <span>1190</span></div>
          <div>Speed Level <span>2</span></div>
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
        gridHeight: 0
      },
      // game grid data
      gameGridData: [],
      // game next tip grid data
      nextTipGridData: [],
      // game data
      gameData: [],
      // next tip data
      nextTipData: [],
      // game status
      gameStatus: true
    }
  },
  methods: {
    /**
     * @description             init game
     * @return     {undefined}  no  return
     */
    initGame () {
      const { initGameCanvas, initNextTipCanvas, getGridData } = this

      initGameCanvas()
      initNextTipCanvas()

      const { gameCanvasWH, nextTipCanvasWH, gameGridConfig, nextTipGridConfig, gameGridData, nextTipGridData } = this

      getGridData(gameCanvasWH, gameGridConfig, gameGridData)
      getGridData(nextTipCanvasWH, nextTipGridConfig, nextTipGridData)

      const { nextTipData, startGame } = this

      nextTipData.push(...getGameItems(100))

      startGame()
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
      console.error(this.nextTipData)
    },
    drawGame () {

    },
    drawNextTip () {

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
        height: 395px;
      }

      .barrage {
        margin-bottom: 10px;
      }

      .time {
        font-size: 100px;
        line-height: 400px;
        text-align: center;
        .text-shadow-big;
      }
    }

    .right {
      .next-tip, .current-info {
        box-sizing: border-box;
        margin-left: 10px;
        box-shadow: 0 0 3px @addi-color;
        height: 395px;
      }

      .next-tip {
        margin-bottom: 10px;
        overflow: hidden;

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
