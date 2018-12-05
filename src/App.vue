<template>
  <div id="app">
    <side-nav :documents="documents" :collapse="!sideNavActive" @select="handleSelect"></side-nav>
    <section class="app-container">
      <header class="app-header">
        <div class="app-header-container">
          <img
            class="app-header-more"
            :class="{ 'active' : sideNavActive }"
            src="@/assets/more.svg"
            @click="handleSwitchActive()">
        </div>
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
              <div v-if="loading === true">
                <span>文档加载中，请稍后</span>
              </div>
              <document-displayer
                v-else-if="loading === false"
                ref="documentDisplayer"
                :document="currentDocument"></document-displayer>
              <div v-else>
                <span>文档加载出错，请检查网络状态后刷新重试</span>
                <!-- 此时loading为错误 -->
                <pre>{{ loading }}</pre>
              </div>
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
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { sendWrapper } from '@/store'
import LdSpliter from './components/spliter'
import LabModule from './components/lab-module'
import SideNav from './components/side-nav'
import DocumentDisplayer from './components/document-displayer'

export default {
  name: 'App',
  components: {
    LdSpliter,
    LabModule,
    SideNav,
    DocumentDisplayer
  },
  data() {
    return {
      sideNavActive: true
    }
  },
  mounted() {
    this.exportSendToWindow()
    this.getDocuments()
  },
  computed: {
    ...mapGetters({
      loading: 'loading',
      documents: 'documents',
      currentDocument: 'currentDocument'
    })
  },
  methods: {
    ...mapMutations({
      switchDocument: 'switchDocument'
    }),
    ...mapActions({
      getDocuments: 'getDocuments'
    }),
    /**
     * 将发送请求功能暴露至window
     */
    exportSendToWindow() {
      window.send = sendWrapper
    },
    /**
     * 切换侧边菜单栏展开情况
     */
    handleSwitchActive() {
      this.sideNavActive = !this.sideNavActive
    },
    /**
     * 处理选中了某个API
     */
    handleSelect(path) {
      const [version] = path // 获取版本
      try {
        this.switchDocument(version) // 尝试切换到目标版本的文档
        this.$refs.documentDisplayer.attach(path)
      } catch (error) {
        this.$message.error(error.message + '，请查看控制台获取更多信息')
      }
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
  font-size: 0.85em;
  width: 100vw;
  height: 100vh;
  display: flex;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
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
  .app-header-more {
    margin: 8px;
    width: 32px;
    height: 32px;
    transition: transform 0.4s;
    &.active {
      transform: rotate(90deg);
    }
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
