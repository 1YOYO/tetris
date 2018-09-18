import { baseInfo } from '@/config'

import { mapState, mapMutations } from 'vuex'

export default {
  watch: {
    loginTime () {
      const { createWebSocketConnectionLooper } = this

      createWebSocketConnectionLooper()
    }
  },
  computed: {
    ...mapState(['loginTime', 'userBaseInfo', 'websocket'])
  },
  methods: {
    /**
     * @description           Create websocket connection
     * @return     {Promise}  Promise
     */
    createWebSocketConnection () {
      const { websocketUrl } = baseInfo

      const { setWebSocketInstance, onOpen, onMessage, $message } = this

      return new Promise((resolve, reject) => {
        const ws = new WebSocket(`ws://${websocketUrl}`)

        setWebSocketInstance(ws)

        ws.onopen = e => {
          $message('WebSocket connection succeeded!', 'success')
          onOpen()
        }

        ws.onmessage = e => {
          onMessage(JSON.parse(e.data))
        }

        ws.onclose = e => {
          $message('Unexpected disconnection of WebSocket!')
          setWebSocketInstance(null)
          reject(e)
        }

        ws.onerror = e => {
          $message('Websocket Error!')
          setWebSocketInstance(null)
          reject(e)
        }
      })
    },
    /**
     * @description             Reconnect websocket when error or close
     * @return     {undefined}  no return
     */
    async createWebSocketConnectionLooper () {
      const { userBaseInfo, createWebSocketConnection } = this

      while (true) {
        if (!userBaseInfo) return

        await createWebSocketConnection().catch(e => e)
        await new Promise(resolve => setTimeout(resolve, 30000))
      }
    },
    /**
     * @description             keep websocket heart
     * @return     {undefined}  no return
     */
    keepWSHeartLooper () {
      const { websocket, sendWSMessage } = this

      if (websocket) sendWSMessage({type: 'heart'})

      setTimeout(this.keepWSHeartLooper, 30000)
    },
    /**
     * @description             websocket on open
     * @return     {undefined}  no return
     */
    onOpen () {
      const { sendWSMessage, userBaseInfo: { TOKEN, UID } } = this

      const message = {
        type: 'connect',
        token: TOKEN,
        uid: UID
      }

      sendWSMessage(message)
    },
    /**
     * @description             websocket on message
     * @return     {undefined}  no return
     */
    onMessage (e) {
      const { status, type, data } = e
      console.error(e)

      if (!status) return

      const { dealConnectMessage, dealOnline, dealChatMessage, dealOffline, dealInterActive } = this

      switch (type) {
        case 'connect': dealConnectMessage(data)
          break

        case 'online': dealOnline(data)
          break

        case 'chat': dealChatMessage(data)
          break

        case 'offline': dealOffline(data)
          break

        case 'interActive': dealInterActive(data)
          break

        default:
          break
      }
    },
    /**
     * @description             deal user connect init message
     * @return     {undefined}  no return
     */
    dealConnectMessage ({leaderBoardHistory, onlineBoard}) {
      const { setLeaderBoardHistoryList, setOnlineBoardList, keepWSHeartLooper } = this

      setLeaderBoardHistoryList(leaderBoardHistory)

      setOnlineBoardList(onlineBoard)

      keepWSHeartLooper()
    },
    /**
     * @description             deal other user online message
     * @return     {undefined}  no return
     */
    dealOnline ({onlineBoard, USERNAME}) {
      const { setOnlineBoardList, pushCharMessage } = this

      setOnlineBoardList(onlineBoard)

      pushCharMessage({
        type: 'online',
        text: `${USERNAME} is online`,
        unique: (new Date()).getTime()
      })
    },
    /**
     * @description             deal user chat message
     * @return     {undefined}  no return
     */
    dealChatMessage ({UID, USERNAME, text, time}) {
      const { userBaseInfo: { UID: SELFUID } } = this

      const { pushCharMessage } = this

      pushCharMessage({
        type: UID === SELFUID ? 'self' : 'other',
        USERNAME,
        text,
        time,
        unique: (new Date()).getTime()
      })
    },
    /**
     * @description             deal other user offline message
     * @return     {undefined}  no return
     */
    dealOffline ({onlineBoard, USERNAME}) {
      const { setOnlineBoardList, pushCharMessage } = this

      setOnlineBoardList(onlineBoard)

      pushCharMessage({
        type: 'offline',
        text: `${USERNAME} is offline`,
        unique: (new Date()).getTime()
      })
    },
    /**
     * @description             deal user inter active
     * @return     {undefined}  no return
     */
    async dealInterActive ({type, UID, USERNAME}) {
      const { sendWSMessage, exConfirm, openFightPage } = this

      if (type === 'Fight') {
        const status = await exConfirm('Fight', `Whether to accept ${USERNAME}'s Fight request?`)

        sendWSMessage({
          type: 'interActive',
          interActiveType: status ? 'acceptFight' : 'refuseFight',
          target: UID
        })

        status && openFightPage(3)
      }

      if (type === 'View') {}

      if (type === 'acceptFight') openFightPage(3)

      if (type === 'refuseFight') {}
    },
    /**
     * @description               open fight page
     * @description  {Int}        countDown before open
     * @return       {undefined}  no return
     */
    openFightPage (countDown) {
      const { exShowTip, closeTip } = this

      exShowTip('Tip', `The game starts after ${countDown} second`)

      if (--countDown < 0) {
        closeTip()

        window.open(this.$router.resolve({ name: 'fight' }).href, '_BLANK')

        return
      }

      setTimeout(e => this.openFightPage(countDown), 1000)
    },
    ...mapMutations(['setWebSocketInstance', 'sendWSMessage', 'setLeaderBoardHistoryList', 'setOnlineBoardList', 'pushCharMessage'])
  }
}
