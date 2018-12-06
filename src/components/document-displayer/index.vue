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
        if (!(this.document.intro)) {
          console.error('document/intro not exist') // eslint-disable-line
          return false
        }
        if (!(this.document.intro.examples instanceof Array)) {
          console.error('document/intro/examples is not an array') // eslint-disable-line
          return false
        }
        if (!(this.document.groups)) {
          console.error('document/groups not exist') // eslint-disable-line
          return false
        } else if (!(this.document.groups instanceof Object)) {
          console.error('document/groups is not an object') // eslint-disable-line
          return false
        }
        for (const groupKey in this.document.groups) {
          const group = this.document.groups[groupKey]
          if (!(group.apis)) {
            console.error(`document/groups/${groupKey}/apis not exist`) // eslint-disable-line
            return false
          } else if (!(group.apis instanceof Object)) {
            console.error(`document/groups/${groupKey}/apis is not an object`) // eslint-disable-line
            return false
          }
          for (const apiKey in group.apis) {
            const api = group.apis[apiKey]
            if (!(api.examples instanceof Array)) {
              return false
              console.error(`document/groups/${groupKey}/apis/${apiKey}/examples is not an array`) // eslint-disable-line
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
