<template>
  <div class="index">
    <div class="guide">
      <h1>排课任务</h1>
      <div class="steps">
        <el-steps style="max-width: 600px" :active="active" finish-status="success">
          <el-step title="选择班级" />
          <el-step title="数据选择" />
          <el-step title="排课中.." />
          <el-step title="排课结果" />
        </el-steps>
      </div>
    </div>
    <div v-show="active === 0" class="chooseclass-container">
      <div class="chooseclass">
        <chooseclass />
        <el-button class="next-button" @click="next">下一步</el-button>
      </div>
    </div>
    <div v-show="active > 0">
      <el-button style="margin-top: 12px" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="ScheduleManagement">
import { ref } from 'vue'
import chooseclass from '@/components/ManualScheduling/chooseclass.vue'

const active = ref(0)

const next = () => {
  if (active.value++ > 2) active.value = 0
}
</script>

<style scoped>
.index {
  display: flex;
  flex-direction: column;
}
.guide {
  display: flex;  
  width: 100%;
}
.steps {
  margin-left: 60px;
  width: 1200px;
  position: relative;
  top: 30px;
}
.chooseclass-container {
  width: 100%;
  position: relative;
  top: 150px;
}
.chooseclass {
  width: 100%;
  padding-left: 60px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.next-button {
  margin-top: 20px;
}
</style>