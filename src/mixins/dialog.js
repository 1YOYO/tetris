import { mapMutations, mapActions } from 'vuex'

export default {
  methods: {
    exConfirm (title, message) {
      const { confirm } = this

      return confirm({ title, message })
    },
    exAlert (title, message) {
      const { alert } = this

      return alert({ title, message })
    },
    exShowTip (title, message) {
      const { showTip } = this

      showTip({ title, message })
    },
    ...mapMutations(['showTip', 'closeTip']),
    ...mapActions(['confirm', 'alert'])
  }
}
