<template>
  <el-card class="lab-module-tips" v-once>
    <h3 class="lab-module-tips-title">使用说明</h3>
    <ol class="lab-module-tips-list">
      <li>打开左侧某个接口，点击 <b>测试</b> 按钮即可将自动将样例请求数据填入右侧的测试区</li>
      <li>点击右侧的 <b>RUN</b> 按钮即可测试接口。</li>
      <li>每次接口测试的结果都会暂存下来，刷新后测试结果将会清空。</li>
      <li>刷新不会清除cookie、session等网站状态信息，<b>如有需要请自行清空</b></li>
    </ol>
  </el-card>
</template>

<script>
export default {
  name: 'LdLabModuleTips'
}
</script>

