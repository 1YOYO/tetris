<template>
  <div id="app">
    <canvas-b-g />
    <router-view/>

    <confirm ref='confirm' />
    <alert ref='alert' />
    <tip ref='tip' />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

import dialog from '@/mixins/dialog'

import websocket from '@/mixins/websocket'

export default {
  name: 'App',
  mixins: [dialog, websocket],
  methods: {
    ...mapMutations(['setAppRootThis'])
  },
  created () {
    const { setAppRootThis } = this

    setAppRootThis(this)
  }
}
</script>

<style lang="less">
#app {
  height: 100%;
  width: 1400px;
  margin: auto;
}
</style>
