<template>
  <div id="confirm-container" v-if="visible">
    <div class="container">
      <div class="title">{{ title }}</div>
      <div class="message">{{ message }}</div>
      <div class="action">
        <div class="cancle">Cancle</div>
        <div class="confirm">Confirm</div>
      </div>
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
     * @description             set confirm title
     * @return     {undefined}  no return
     */
    setTitle (title) {
      this.title = title
    },
    /**
     * @description             set confirm message
     * @return     {undefined}  no return
     */
    setMessage (message) {
      this.message = message
    },
    /**
     * @description             do only once callback when event be triggered
     * @return     {undefined}  no return
     */
    doOnceEventCallBack (element, event, callback) {
      element.addEventListener(event, function fun (e) {
        e.target.removeEventListener(e.type, fun)
        return callback(e)
      }, false)
    },
    /**
     * @description           show confirm
     * @return     {Promise}  Promise
     */
    confirm (title, message) {
      const { $nextTick, doOnceEventCallBack, setTitle, setMessage } = this

      setTitle(title)
      setMessage(message)

      this.visible = true

      return $nextTick().then(e => {
        const cancle = document.querySelector('#confirm-container .cancle')
        const confirm = document.querySelector('#confirm-container .confirm')

        return new Promise(resolve => {
          doOnceEventCallBack(cancle, 'click', e => {
            resolve(false)
            this.visible = false
          })
          doOnceEventCallBack(confirm, 'click', e => {
            resolve(true)
            this.visible = false
          })
        })
      })
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/color.less';

#confirm-container {
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

    .action {
      height: 30px;
      text-align: center;
      line-height: 30px;
      font-weight: bold;

      .cancle, .confirm {
        float: left;
        width: 50%;
        cursor: pointer;
        box-sizing: border-box;
        transition: all 0.3s;
      }

      .cancle {
        color: @addi-color;
        background-color: #fff;

        &:hover {
          background-color: @addi-color;
          color: #fff;
        }

        &:active {
          border: 1px solid fade(@addi-color, 50);
        }
      }

      .confirm {
        color: #fff;
        background-color: @deep-color;

        &:active {
          border: 1px solid fade(@deep-color, 50);
        }
      }
    }
  }
}
</style>
