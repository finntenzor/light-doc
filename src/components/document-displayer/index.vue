<template>
  <div v-if="valid" class="document-displayer">
    <document-intro
      :intro="document.intro"></document-intro>
    <document-group
      v-for="(group, key) in document.groups"
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
      try {
        if (!(this.document.intro instanceof Array)) {
          return false
        }
        for (const groupKey in this.document.groups) {
          const group = this.document.groups[groupKey]
          for (const apiKey in group) {
            const api = group[apiKey]
            if (!(api.examples instanceof Array)) {
              return false
            }
          }
        }
      } catch (err) {
        console.error(err) // eslint-disable-line
        return false
      }
      return true
    },
    /**
     * 由各个模块和其名字组成的map
     */
    groupMap() {
      if (!this.valid) {
        return {}
      }
      const map = {}
      this.$refs.groups.forEach(item => {
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
        console.warn('Group not found: ', path) // eslint-disable-line
        throw new Error('Group不存在')
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
