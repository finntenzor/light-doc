<template>
  <div id="app">
    <ld-spliter>
      <div slot="left">
        <p>Left</p>
      </div>
      <div slot="right">
        <request-sender></request-sender>
      </div>
    </ld-spliter>
  </div>
</template>

<script>
import LdSpliter from './components/spliter'
import RequestSender from './components/request-sender'
import { sendWrapper } from '@/store'

export default {
  name: 'App',
  components: {
    LdSpliter,
    RequestSender
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
