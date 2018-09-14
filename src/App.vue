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

export default {
  name: 'App',
  methods: {
    aaaa () {
      console.error(this.$confirm)
    },
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
