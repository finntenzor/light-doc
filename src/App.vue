<template>
  <div id="app">
    <ld-spliter>
      <div slot="left">
        <p>Left</p>
      </div>
      <div slot="right">
        <lab-module></lab-module>
      </div>
    </ld-spliter>
  </div>
</template>

<script>
import LdSpliter from './components/spliter'
import LabModule from './components/lab-module'
import { sendWrapper } from '@/store'

export default {
  name: 'App',
  components: {
    LdSpliter,
    LabModule
  },
  mounted() {
    this.exportSendToWindow()
  },
  methods: {
    /**
     * 将发送请求功能暴露至window
     */
    exportSendToWindow() {
      window.send = sendWrapper
    }
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
#app {
  width: 100vw;
  height: 100vh;
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // color: #2c3e50;
}
</style>
