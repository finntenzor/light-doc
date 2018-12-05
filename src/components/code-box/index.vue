<template>
  <pre ref="box" class="code-box" :class="{ 'one-line': oneLine }">{{ code }}</pre>
</template>

<script>
export default {
  name: 'LdCodeBox',
  props: {
    code: {
      type: [String, Object, Array, Boolean, Number],
      required: true
    },
    oneLine: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 获取已经排版的字符串，暂时没有找到更好的办法
    getText() {
      const box = this.$refs.box
      return box ? box.innerHTML : ''
    }
  }
}
</script>

<style>
.code-box {
  padding: 3px;
  border: 1px solid #aaa;
  background-color: #f5f5f5;
  color: #c0341d;
  font-family: Consolas, Menlo, Courier, monospace;
  overflow-x: auto;
}
.code-box.one-line {
  overflow-x: hidden;
}
</style>
