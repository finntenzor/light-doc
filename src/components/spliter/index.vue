<template>
  <div class="ld-spliter" ref="box">
    <div class="ld-spliter-panel left" ref="left" :style="leftStyle">
      <slot name="left"></slot>
    </div>
    <div class="ld-spliter-slider" @mousedown="handleDown" @touchstart="handleDown">
      <div class="ld-spliter-slider-icon"></div>
    </div>
    <div class="ld-spliter-panel right" :style="rightStyle">
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
    },
    rightStyle() {
      const boxWidth = this.getBoxWidth()
      const leftWidth = this.rate * boxWidth
      const rightWidth = boxWidth - 20 - leftWidth
      const rate = rightWidth / boxWidth
      return {
        'width': rate * 100 + '%'
      }
    }
  },
  mounted() {
    const boxWidth = this.getBoxWidth()
    this.oldRate = this.rate = (boxWidth - 20) / 2 / boxWidth
  },
  methods: {
    getBoxWidth() {
      const box = this.$refs.box
      return box ? box.clientWidth : 1
    },
    handleOffset(offset) {
      const boxWidth = this.getBoxWidth()
      const rate = this.oldRate + offset / boxWidth
      this.rate = Math.max(0.15, Math.min(0.85, rate))
    },
    handleMove(e) {
      if (e instanceof MouseEvent) {
        const offset = e.pageX - this.downX
        this.handleOffset(offset)
      } else if (e instanceof TouchEvent) {
        const touch = e.changedTouches[0]
        const offset = (touch ? touch.pageX : this.downX) - this.downX
        this.handleOffset(offset)
      }
    },
    handleUp() {
      off('touchmove', this.handleMove)
      off('touchend', this.handleUp)
      off('mousemove', this.handleMove)
      off('mouseup', this.handleUp)
    },
    handleDown(e) {
      const leftWidth = this.$refs.left.clientWidth
      const boxWidth = this.getBoxWidth()
      this.oldRate = leftWidth / boxWidth
      if (e instanceof MouseEvent) {
        this.downX = e.pageX
        on('mousemove', this.handleMove)
        on('mouseup', this.handleUp)
      } else if (e instanceof TouchEvent) {
        const touch = e.changedTouches[0]
        this.downX = touch ? touch.pageX : this.downX
        on('touchmove', this.handleMove)
        on('touchend', this.handleUp)
      }
    }
  }
}
</script>

<style>
.ld-spliter {
  display: flex;
  overflow: hidden;
  width: 100%;
}
.ld-spliter-panel {
  overflow-x: hidden;
}
.ld-spliter-panel.right {
  flex-grow: 1;
}
.ld-spliter-slider {
  position: relative;
  z-index: 9999;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 0 0 20px;
  overflow-y: hidden;
  width: 20px;
  border-left: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  background-color: #fff;
  cursor: col-resize;
}
.ld-spliter-slider-icon {
  width: 100%;
  height: 100%;
  background: url('~@/assets/spliter/icon.png');
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
