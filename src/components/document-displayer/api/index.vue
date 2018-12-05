<template>
  <div class="document-api">
    <div class="document-api-header">
      <api-general :api="api" @prepare="handlePrepare"></api-general>
      <div class="document-api-description-container">
        <h3>接口描述</h3>
        <p class="document-api-description">{{ api.description }}</p>
      </div>
    </div>
    <div class="document-api-main">
      <h3>请求样例</h3>
      <api-example
        v-for="(example, i) in api.examples"
        ref="apiExample"
        :key="i"
        :example="example"
        :url="api.url">
      </api-example>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import ApiGeneral from './general'
import ApiExample from './example'

export default {
  name: 'LdDocumentApi',
  components: {
    ApiGeneral,
    ApiExample
  },
  props: {
    api: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapMutations({
      setRequestTitle: 'setRequestTitle',
      setRequestUrl: 'setRequestUrl',
      setRequestMethod: 'setRequestMethod',
      setRequestBody: 'setRequestBody'
    }),
    handlePrepare(api) {
      const example = this.$refs.apiExample[0]
      this.setRequestUrl(example.compUrl)
      this.setRequestMethod(api.method.toLowerCase())
      this.setRequestBody(example.getBody())
      this.setRequestTitle(api.name)
    }
  }
}
</script>

<style lang="scss">
@import '~@/styles.scss';
@import './card.scss';

.document-api-header {
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}
.document-api-main {
  padding: 10px;
}
.document-api-description-container {
  margin-top: 10px;
}
.document-api-description {
  text-indent: 2em;
}
</style>
