<template>
  <div class="document-api-general">
    <div :class="[ methodLower ]" class="document-api-general-method">
      <span>{{ methodName }}</span>
    </div>
    <div class="document-api-general-url">
      <span>{{ api.url }}</span>
    </div>
    <el-button type="success" @click="$emit('prepare', api)">测试</el-button>
  </div>
</template>

<script>
import { allMethods } from '@/consts'

export default {
  name: 'LdDocumentApiGeneral',
  props: {
    api: {
      type: Object,
      required: true
    }
  },
  computed: {
    methodLower() {
      return (this.api.method || '').toLowerCase()
    },
    methodName() {
      if (allMethods.indexOf(this.methodLower) !== -1) {
        return this.methodLower.toUpperCase()
      }
      return 'Invalid Method'
    }
  }
}
</script>

<style lang="scss">
@import '~@/styles.scss';
@import './card.scss';

.document-api-general {
  display: flex;
}
.document-api-general-method,
.document-api-general-url {
  @include card;
  display: inline-flex;
  align-items: center;
  font-size: 1.4em;
}
.document-api-general-method {
  @include method-styles;
  color: white;
  font-weight: bold;
}
.document-api-general-url {
  flex-grow: 1;
  margin: 0 10px;
  color: #c0341d;
  background-color: #fcedea;
}
</style>
