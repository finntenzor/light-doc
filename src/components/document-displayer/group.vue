<template>
  <el-card class="document-group">
    <div slot="header" class="document-group-header">
      <h2 class="document-group-title">{{ group.name }}</h2>
      <el-button type="text" @click="handleAction()">{{ shouldFold ? '全部折叠' : '全部展开' }}</el-button>
    </div>
    <el-collapse v-model="actives">
      <el-collapse-item
        v-for="(api, apiKey) in group.apis"
        :key="apiKey"
        :title="api.name"
        :name="apiKey">
        <a class="document-group-api-title" ref="anchor" slot="title" :data-key="apiKey" href="" @click.prevent>{{ api.name }}</a>
        <document-api :api="api"></document-api>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script>
import DocumentApi from './api'

export default {
  name: 'GroupDisplayer',
  components: {
    DocumentApi
  },
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      actives: []
    }
  },
  computed: {
    // 是否应该显示全部折叠
    shouldFold() {
      return this.actives.length !== 0
    },
    // 锚点map
    anchorMap() {
      const map = {}
      this.$refs.anchor.forEach(a => {
        const key = a.dataset.key
        map[key] = a
      })
      return map
    }
  },
  methods: {
    // 按钮动作，展开或者折叠
    handleAction() {
      if (this.shouldFold) {
        this.actives = []
      } else {
        for (const key in this.group.apis) {
          this.actives.push(key)
        }
      }
    },
    // 跳转到某个key对应的接口上
    attach(path) {
      const [,, key] = path
      const anchor = this.anchorMap[key]
      if (anchor) {
        if (this.actives.indexOf(key) === -1) {
          this.actives.push(key)
          setTimeout(() => {
            anchor.scrollIntoView()
          }, 200)
        } else {
          anchor.scrollIntoView()
        }
      } else {
        console.warn('API not found: ', path) // eslint-disable-line
        throw new Error('API不存在')
      }
    }
  }
}
</script>

<style lang="scss">
.document-group {
  margin: 20px 0;
}
.document-group-header {
  display: flex;
}
.document-group-title {
  font-weight: normal;
  flex-grow: 1;
  font-size: 1.4em;
}
.document-group-api-title {
  color: #419bfc;
  text-decoration: none;
}
</style>
