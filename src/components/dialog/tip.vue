<template>
  <div id="tip-container" v-if="visible">
    <div class="container">
      <div class="title">{{ title }}</div>
      <div class="message">{{ message }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Confirm',
  data () {
    return {
      title: '',
      message: '',
      visible: false
    }
  },
  methods: {
    /**
     * @description             set alert title
     * @return     {undefined}  no return
     */
    setTitle (title) {
      this.title = title
    },
    /**
     * @description             set alert message
     * @return     {undefined}  no return
     */
    setMessage (message) {
      this.message = message
    },
    /**
     * @description             show tip dialog
     * @return     {undefined}  no return
     */
    showTip (title, message) {
      const { setTitle, setMessage } = this

      setTitle(title)
      setMessage(message)

      this.visible = true
    },
    /**
     * @description             close tip dialog
     * @return     {undefined}  no return
     */
    closeTip () {
      this.visible = false
      this.title = ''
      this.message = ''
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/color.less';

#tip-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background-color: fade(gray, 30);

  .container {
    position: absolute;
    width: 400px;
    top: 35%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    box-shadow: 0 0 3px @main-color;
    border-radius: 10px;
    overflow: hidden;
    color: #fff;

    .title {
      height: 30px;
      background-color: @addi-color;
      font-weight: bold;
      font-size: 16px;
      line-height: 30px;
      text-align: center;
    }

    .message {
      position: relative;
      text-align: center;
      color: @input-color;
      font-weight: bold;
      background-color: #fff;
      box-sizing: border-box;
      padding: 30px 20px;
      box-shadow: 0 0 3px @addi-color;
      word-wrap: break-word;
    }
  }
}
</style>
