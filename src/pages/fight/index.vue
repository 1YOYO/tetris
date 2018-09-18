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
        <div class="next-tip">next tip</div>
        <div class="current-info">current-info</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Fight',
  data () {
    return {}
  },
  methods: {}
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
        box-shadow: 0 0 3px @deep-color;
        height: 395px;
      }

      .next-tip {
        margin-bottom: 10px;
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
