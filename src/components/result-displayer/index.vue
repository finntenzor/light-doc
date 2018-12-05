<template>
  <div class="result-displayer">
    <!-- 标题状态信息 -->
    <div :class="[ typeClassName ]" class="result-displayer-type">
      <h3>{{ typeText }} - {{ response.status }} {{ response.statusText }}</h3>
    </div>
    <ul class="result-displayer-details">
      <!-- 响应体，始终显示 -->
      <li>
        <h4 class="result-displayer-subtitle">响应体</h4>
        <code-box :code="response.data"></code-box>
      </li>
      <!-- 响应头，默认隐藏 -->
      <li>
        <h4 class="result-displayer-subtitle">响应头</h4>
        <el-switch class="result-displayer-switch" v-model="showHeaders"></el-switch>
        <code-box v-show="showHeaders" :code="response.headers"></code-box>
      </li>
      <!-- 请求配置，默认隐藏 -->
      <li>
        <h4 class="result-displayer-subtitle">请求配置</h4>
        <el-switch class="result-displayer-switch" v-model="showConfig"></el-switch>
        <code-box v-show="showConfig" :code="response.config"></code-box>
      </li>
    </ul>
  </div>
</template>

<script>
import { toText, toClassName } from './config'
import CodeBox from '@/components/code-box'

export default {
  name: 'ResultDisplayer',
  components: {
    CodeBox
  },
  props: {
    type: {
      type: String,
      required: true
    },
    response: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showHeaders: false,
      showConfig: false
    }
  },
  computed: {
    typeText() {
      return toText(this.type)
    },
    typeClassName() {
      return toClassName(this.type)
    }
  }
}
</script>

<style lang="scss">
@import '~@/styles.scss';

.result-displayer-type {
  border-radius: 4px;
  display: inline-block;
  padding: 2px 10px;
  color: white;
  font-size: 1.4em;
  font-weight: bold;
  background-color: #606266;
  @include type-styles;
}
.result-displayer-subtitle,
.result-displayer-switch {
  margin: 5px 0;
}
</style>
