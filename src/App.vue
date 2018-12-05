<template>
  <div id="app">
    <side-nav :docs="[doc.data]"></side-nav>
    <section class="app-container">
      <header class="app-header">
        <div class="app-header-container"></div>
        <div class="app-header-logo-container">
          <img class="app-header-logo" src="@/assets/logo.svg" alt="">
        </div>
        <div class="app-header-container"></div>
      </header>
      <section class="app-main">
        <div class="app-main-container">
          <ld-spliter class="app-main-spliter">
            <!-- 文档区 -->
            <div slot="left">
              <p>Left</p>
            </div>
            <!-- 测试区 -->
            <div slot="right">
              <lab-module></lab-module>
            </div>
          </ld-spliter>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
import LdSpliter from './components/spliter'
import LabModule from './components/lab-module'
import SideNav from './components/side-nav'
import { sendWrapper } from '@/store'
import doc from './fake-doc'

export default {
  name: 'App',
  components: {
    LdSpliter,
    LabModule,
    SideNav
  },
  data() {
    return {
      doc
    }
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
  display: flex;
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // color: #2c3e50;
  .app-container {
    flex: 1 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  .app-header {
    display: flex;
    flex: 0 0 48px;
    border-bottom: 1px solid #f0f0f0;
  }
  .app-header-container {
    width: 48px;
  }
  .app-header-logo-container {
    flex: 1 0;
    margin: 8px 0;
    height: 32px;
    text-align: center;
  }
  .app-header-logo {
    width: 32px;
    height: 32px;
    user-select: none;
  }
  .app-main {
    flex-grow: 1;
    overflow: auto;
    // 此处相对定位和app-main-container的绝对定位配合
    // 保证在flex布局下，app-main-container可以占满父元素
    position: relative;
  }
  .app-main-container {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
</style>
