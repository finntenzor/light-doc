<template>
  <pre class="code-box">{{ code }}</pre>
</template>

<script>
export default {
  name: 'CodeBox',
  props: {
    code: {
      type: [String, Object, Array, Boolean, Number],
      required: true
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
  overflow-x: auto;
}
</style>
