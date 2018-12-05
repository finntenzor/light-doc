<template>
  <div v-if="valid" class="document-displayer">
    <document-intro
      :intro="document.intro"></document-intro>
    <document-group
      v-for="(group, key) in groups"
      ref="group"
      :key="key"
      :group="group"
    ></document-group>
  </div>
  <div v-else>
    <p>文档格式错误，请参考Network以及控制台输出</p>
  </div>
</template>

<script>
import DocumentGroup from './group'
import DocumentIntro from './intro'

export default {
  name: 'LdDocumentDisplayer',
  components: {
    DocumentGroup,
    DocumentIntro
  },
  props: {
    document: {
      type: Object,
      required: true
    }
  },
  computed: {
    valid() {
      return !!this.document.groups
    },
    groups() {
      return this.document.groups || []
    },
    /**
     * 由各个模块和其名字组成的map
     */
    groupMap() {
      const map = {}
      this.$refs.group.forEach(item => {
        const key = item.$vnode.data.key
        map[key] = item
      })
      return map
    }
  },
  methods: {
    /**
     * 跳转到某个接口上
     */
    attach(path) {
      const [, group] = path
      const documentGroup = this.groupMap[group]
      if (documentGroup) {
        documentGroup.attach(path)
      } else {
        throw new Error('Group不存在')
        console.warn('Group not found: ', path) // eslint-disable-line
      }
    }
  }
}
</script>

<style>
.document-displayer {
  padding: 0 20px;
}
</style>
