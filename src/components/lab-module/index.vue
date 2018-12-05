<template>
  <div class="lab-module">
    <!-- 请求发送 -->
    <el-card class="lab-module-sender">
      <request-sender></request-sender>
    </el-card>
    <!-- 结果显示 -->
    <el-card class="lab-module-results">
      <el-collapse v-model="activeNames">
        <!-- 一次请求的结果 -->
        <el-collapse-item
          v-for="item in results"
          :key="item.id"
          :title="buildTitle(item)"
          :name="item.id">
          <result-displayer
            :type="item.type"
            :response="item.response"></result-displayer>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <!-- 相关提示 -->
    <lab-module-tips class="lab-module-tips"></lab-module-tips>
  </div>
</template>

<script>
import RequestSender from '@/components/request-sender'
import ResultDisplayer from '@/components/result-displayer'
import LabModuleTips from './tips'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'LdLabModule',
  components: {
    RequestSender,
    ResultDisplayer,
    LabModuleTips
  },
  computed: {
    ...mapGetters({
      typeToText: 'typeToText',
      results: 'results',
      getActiveNames: 'activeNames'
    }),
    activeNames: {
      get() {
        return this.getActiveNames
      },
      set(value) {
        this.setActiveNames(value)
      }
    }
  },
  methods: {
    ...mapMutations({
      setActiveNames: 'setActiveNames'
    }),
    buildTitle(item) {
      return `#${item.id} ${item.title} ${this.typeToText(item.type)}`
    }
  }
}
</script>

<style>
.lab-module {
  padding: 0 20px;
}
.lab-module-sender,
.lab-module-results,
.lab-module-tips {
  margin: 20px 0;
}
</style>
