<template>
  <div class="document-api-example">
    <h4>{{ example.description }}</h4>
    <div class="document-api-example-description">
      <h5>请求地址</h5>
      <code-box :code="compUrl" one-line></code-box>
    </div>
    <div class="document-api-example-main">
      <div class="document-api-example-request">
        <h5>请求</h5>
        <code-box ref="body" :code="example.request.body" v-if="example.request.body"></code-box>
        <code-box code="（无需请求体）" v-else></code-box>
      </div>
      <div class="document-api-example-response">
        <h5>响应</h5>
        <code-box :code="example.response"></code-box>
      </div>
    </div>
  </div>
</template>

<script>
import CodeBox from '@/components/code-box'
import { parseHTML } from 'vue'

export default {
  name: 'LdDocumentApiExample',
  components: {
    CodeBox
  },
  props: {
    url: {
      type: String,
      required: true
    },
    example: {
      type: Object,
      required: true
    }
  },
  computed: {
    compUrl() {
      let url = this.url
      const request = this.example.request
      // 替换URL参数
      const params = request.params
      if (params) {
        for (const key in params) {
          url = url.replace(':' + key, params[key])
        }
      }
      // 替换查询字符串
      const query = request.query
      if (query) {
        url += '?' + Object.keys(query).map(key => `${key}=${query[key]}`).join('&')
      }
      return url
    }
  },
  methods: {
    // 获取已经排版的请求体
    getBody() {
      const body = this.$refs.body
      return body ? body.getText() : ''
    }
  },
  mounted() {
    window.parseHTML = parseHTML
  }
}
</script>

<style lang="scss">
@import './card.scss';

.document-api-example {
  @include card(true);
  padding: 5px;
  margin-top: 10px;
  h5 {
    font-size: 1em;
    font-weight: normal;
  }
}
.document-api-example-main {
  margin-top: 5px;
  display: flex;
}
.document-api-example-request,
.document-api-example-response {
  box-sizing: border-box;
  padding: 0 3px;
  width: 50%;
}
.document-api-example-request {
  padding-left: 0;
}
.document-api-example-response {
  padding-right: 0;
}
</style>
