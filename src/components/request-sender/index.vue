<template>
  <div class="request-sender">
    <el-row type="flex">
      <!-- 请求地址 -->
      <el-input
        :value="url"
        @input="setRequestUrl($event)"
        placeholder="请求地址"
      >
        <!-- 请求方法 -->
        <el-select
          slot="prepend"
          :value="method"
          @input="setRequestMethod($event)"
          placeholder="请求方法"
          class="request-sender-method"
        >
          <el-option
            v-for="item in methodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-input>
      <!-- 动作按钮 -->
      <div class="request-sender-action">
        <el-button v-if="canRun" type="success" @click="runRequest()">RUN</el-button>
        <el-button v-else type="danger">ERROR</el-button>
      </div>
    </el-row>
    <!-- 请求体输入区 -->
    <el-input
      v-if="canHasData"
      :rows="4"
      :value="body"
      class="request-sender-body"
      type="textarea"
      placeholder="请输入请求体（JSON）"
      @input="setRequestBody($event)"
    ></el-input>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { allMethods } from '@/consts'

export default {
  name: 'LdRequestSender',
  data() {
    const methodOptions = allMethods.map(method => ({
      label: method.toUpperCase(),
      value: method
    }))
    return {
      methodOptions
    }
  },
  computed: {
    ...mapGetters({
      url: 'requestUrl',
      method: 'requestMethod',
      body: 'requestBody',
      isBodyValid: 'requestBodyValid',
      canHasData: 'requestCanHasData',
      request: 'request'
    }),
    // 是否可以执行请求
    canRun() {
      if (allMethods.indexOf(this.method) !== -1) {
        return this.canHasData ? this.isBodyValid : true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapMutations({
      setRequestUrl: 'setRequestUrl',
      setRequestMethod: 'setRequestMethod',
      setRequestBody: 'setRequestBody'
    }),
    ...mapActions({
      send: 'send'
    }),
    runRequest() {
      // 发送请求
      try {
        this.send(this.request)
      } catch {
      }
    }
  }
}
</script>

<style>
.request-sender-method {
  width: 110px;
}
.request-sender-action {
  margin-left: 10px;
}
.request-sender-body {
  margin-top: 10px;
}
</style>
