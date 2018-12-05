<template>
  <aside class="side-nav" :class="{ 'collapse' : collapse }">
    <el-menu
      :collapse="collapse"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect">
      <!-- 各版本的文档 -->
      <el-submenu
        v-for="(doc, i) in docs"
        :key="i"
        :index="doc.version">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>API {{ doc.version }}</span>
        </template>
        <!-- 各模块的文档 -->
        <el-submenu
          v-for="(group, groupKey) in doc.groups"
          :key="groupKey"
          :index="`${doc.version}${groupKey}`">
          <template slot="title">{{ group.name }}</template>
          <!-- 各接口的文档 -->
          <el-menu-item
            v-for="(api, apiKey) in group.apis"
            :key="apiKey"
            :index="`${doc.version}${groupKey}${apiKey}`">{{ api.name }}</el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>
  </aside>
</template>

<script>
function minus(a, b) {
  return a.replace(new RegExp('^' + b), '')
}

export default {
  name: 'LdSideNav',
  props: {
    docs: {
      type: Array,
      required: true
    },
    collapse: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleSelect(_, keyPath) {
      const [a, b, c] = keyPath
      if (a && b && c) {
        const api = minus(c, b)
        const group = minus(b, a)
        const doc = a
        const path = [doc, group, api]
        this.$emit('select', path)
      } else {
        console.warn('Can\'t resolve path: ', keyPath) // eslint-disable-line
      }
    }
  }
}
</script>

<style lang="scss">
.side-nav {
  background: #545c64;
  height: 100vh;
  overflow-y: auto;
  width: 64px;
  transition: width 0.4s;
  &:not(.collapse) {
    width: 200px;
  }
}
.side-nav .el-menu {
  border-right: none;
}
</style>
