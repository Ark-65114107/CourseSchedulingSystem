
<template>
<ElConfigProvider :locale="zhCn">
  <router-view></router-view>
  </ElConfigProvider>
</template>


<script>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
export default {
  name: "App",
  setup(){
    return {
      zhCn,
      ElConfigProvider
    }
  }
};
</script>


<style>
html,
body {
  height: 100%;
  padding: 0;
  margin: 0;
}
#app {
  height: 100%;
  overflow: hidden;
  background: #f5f7fa;
}

router-link {
  all: unset;
}
.el-message .el-message__badge{
  display: none;
}

</style>
