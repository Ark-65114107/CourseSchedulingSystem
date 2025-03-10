<template>
  <div class="dashboard-container">
    <!-- 顶部标题栏 -->
    <div class="header">
      <div class="title">欢迎使用本排课系统</div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧内容 -->
      <div class="left-panel">
        <!-- 通知模块 -->
        <NotificationModule />
        
        <!-- 快捷操作模块 -->
        <QuickActionModule />
        
        <!-- 下载模块 -->
        <DownloadModule />
      </div>

      <!-- 右侧内容 -->
      <div class="right-panel">
        <!-- 教师信息模块 -->
        <TeacherInfoModule />
        
        <!-- 课表模块 -->
        <NewCourseScheduleModule />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="index">
import NotificationModule from '@/components/index/NotificationModule.vue'
import QuickActionModule from '@/components/index/QuickActionModule.vue'
import DownloadModule from '@/components/index/DownloadModule.vue'
import TeacherInfoModule from '@/components/index/TeacherInfoModule.vue'
import CourseScheduleModule from '@/components/index/CourseScheduleModule.vue'
import NewCourseScheduleModule from '@/components/index/NewCourseScheduleModule.vue'
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.header {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #2E75B6;
  color: white;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

.main-content {
  display: flex;
  padding: 16px;
  gap: 16px;
  height: auto;
}

.left-panel, .right-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.left-panel {
  flex: 1;
}

.right-panel {
  flex: 2;
}
</style>

