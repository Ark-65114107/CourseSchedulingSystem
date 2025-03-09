<template>
    <div class="panel-card">
      <div class="panel-header">
        <h2>快捷操作</h2>
        <el-button type="text" class="refresh-btn">
          <el-icon><Refresh /></el-icon>
        </el-button>
      </div>
      <div class="panel-content quick-actions">
        <el-button type="primary" class="action-btn" @click="viewSchedule">
          <el-icon><Calendar /></el-icon>
          <span>查看课表</span>
        </el-button>
        <el-button type="primary" class="action-btn" @click="manageScheduleTasks">
          <el-icon><List /></el-icon>
          <span>排课任务</span>
        </el-button>
        <el-button type="primary" class="action-btn" @click="fillInformation">
          <el-icon><Edit /></el-icon>
          <span>信息填写</span>
        </el-button>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { Calendar, List, Edit, Refresh } from '@element-plus/icons-vue'
  import { RouterView,RouterLink,useRouter } from 'vue-router';

  const router = useRouter()
  // 查看课表
  function viewSchedule() {
    console.log('查看课表')
    // 这里可以添加查看课表的逻辑，例如跳转到课表详情页
    router.push('/home/task/showSchedule')
  }
  
  // 管理排课任务
  function manageScheduleTasks() {
    console.log('管理排课任务')
    // 这里可以添加管理排课任务的逻辑，例如跳转到排课任务管理页面
    router.push('/home/task/scheduleManagement')
  }
  
  // 填写信息
  function fillInformation() {
    console.log('填写信息')
    // 这里可以添加填写信息的逻辑，例如打开信息填写表单
    router.push({name:'fillInformation'})
  }
  </script>
  
  <style scoped>
  .panel-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    border-bottom: 1px solid #ebeef5;
  }
  
  .panel-header h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    display: flex;
    align-items: center;
  }
  
  .panel-content {
    padding: 15px 20px;
  }
  
  .quick-actions {
    display: flex;
    gap: 15px;
    justify-content: space-between;
  }
  
  .action-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    gap: 10px;
  }
  
  .action-btn .el-icon {
    font-size: 24px;
  }
  </style>
  
  