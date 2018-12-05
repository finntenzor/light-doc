<template>
  <el-card class="document-intro">
    <div slot="header">
      <h2 class="document-intro-title">综述</h2>
      <p class="document-intro-description">{{ intro.description }}</p>
    </div>
    <div v-for="(item, i) in intro.examples" :key="i" class="document-intro-example">
      <h3 class="document-intro-description-title">{{ item.description }}</h3>
      <code-box :code="item.response"></code-box>
    </div>
  </el-card>
</template>

<script>
import CodeBox from '@/components/code-box'

export default {
  name: 'LdDocumentIntro',
  components: {
    CodeBox
  },
  props: {
    intro: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
.document-intro-title {
  font-size: 2.2em;
}
.document-intro-description {
  text-indent: 2em;
}
.document-intro-description-title {
  margin: 3px 0;
}
.document-intro-example {
  margin: 8px 0;
}
</style>
