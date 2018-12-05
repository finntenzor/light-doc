<template>
  <div class="ld-spliter" ref="box">
    <div class="ld-spliter-panel left" ref="left" :style="leftStyle">
      <slot name="left"></slot>
    </div>
    <div class="ld-spliter-slider" @mousedown="handleDown"></div>
    <div class="ld-spliter-panel right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
const listenerConfig = {
  capture: false,
  passive: true
}

function on(event, handler) {
  document.addEventListener(event, handler, listenerConfig)
}

function off(event, handler) {
  document.removeEventListener(event, handler, listenerConfig)
}

export default {
  name: 'LdSpliter',
  data() {
    return {
      downX: 0,
      oldRate: 0,
      rate: 0
    }
  },
  computed: {
    leftStyle() {
      return {
        'width': this.rate * 100 + '%'
      }
    }
  },
  mounted() {
    const boxWidth = this.getBoxWidth()
    this.oldRate = this.rate = (boxWidth - 20) / 2 / boxWidth
  },
  methods: {
    getBoxWidth() {
      return this.$refs.box.clientWidth
    },
    handleMove(e) {
      const offset = e.pageX - this.downX
      const boxWidth = this.getBoxWidth()
      const rate = this.oldRate + offset / boxWidth
      this.rate = Math.max(0.15, Math.min(0.85, rate))
    },
    handleUp() {
      off('mousemove', this.handleMove)
      off('mouseup', this.handleUp)
    },
    handleDown(e) {
      const leftWidth = this.$refs.left.clientWidth
      const boxWidth = this.getBoxWidth()
      this.downX = e.pageX
      this.oldRate = leftWidth / boxWidth
      on('mousemove', this.handleMove)
      on('mouseup', this.handleUp)
    }
  }
}
</script>

<style>
.ld-spliter {
  display: flex;
  overflow: hidden;
}
.ld-spliter-panel.right {
  flex-grow: 1;
}
.ld-spliter-slider {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 0 0 20px;
  overflow-y: hidden;
  width: 20px;
  border-left: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  background: url('~@/assets/spliter/icon.png');
  background-repeat: no-repeat;
  background-position: center center;
  cursor: col-resize;
}
</style>
