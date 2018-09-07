function confirm (title = 'Tip', message = 'confrim message') {
  return this.$refs['confirm'].confirm(title, message)
}

function alert (title = 'Tip', message = 'alert message') {
  return this.$refs['alert'].alert(title, message)
}

function showTip (title = 'Tip', message = 'tip message') {
  return this.$refs['tip'].showTip(title, message)
}

function closeTip () {
  return this.$refs['tip'].closeTip()
}

export default function (Vue) {
  Vue.prototype.$confirm = confirm
  Vue.prototype.$alert = alert
  Vue.prototype.$showTip = showTip
  Vue.prototype.$closeTip = closeTip
}
