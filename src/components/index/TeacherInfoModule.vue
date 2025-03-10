<template>
    <div class="panel-card">
      <div class="panel-header">
        <h2>教师信息</h2>
      </div>
      <div class="panel-content teacher-info">
        <!-- 信息卡片 -->
        <div class="info-cards">
          <div class="info-card">
            <div class="info-icon">
              <el-icon><Document /></el-icon>
            </div>
            <div class="info-value">{{ teacherInfo.totalCourses }}</div>
            <div class="info-label">总课程数量</div>
          </div>
          <div class="info-card">
            <div class="info-icon">
              <el-icon><Calendar /></el-icon>
            </div>
            <div class="info-value">{{ teacherInfo.todayCourses }}</div>
            <div class="info-label">今日需上课程数</div>
          </div>
          <div class="info-card">
            <div class="info-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="info-value">{{ teacherInfo.workStatus }}</div>
            <div class="info-label">在岗状态</div>
          </div>
        </div>
  
        <!-- 详细信息列表 -->
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">当前时间:</span>
            <span class="info-value">{{ currentTime }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">教师姓名:</span>
            <span class="info-value">{{ teacherInfo.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">本周课程总数:</span>
            <span class="info-value">{{ teacherInfo.weekCourses }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">学期状态:</span>
            <span class="info-value">{{ teacherInfo.semesterStatus }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { Document, Calendar, User } from '@element-plus/icons-vue'
  import { fetchTeacherData } from '@/api/teacher.index'
  
  // 当前时间
  const currentTime = ref(updateCurrentTime())
  
  // 教师信息
  const teacherInfo = ref({
    name: '张教授',
    totalCourses: 6,
    todayCourses: 2,
    weekCourses: 12,
    workStatus: '在岗',
    semesterStatus: '进行中'
  })
  
  // 更新时间的函数
  function updateCurrentTime() {
    const now = new Date()
    return now.toLocaleTimeString()
  }
  
  // 每秒更新一次时间
  const timeInterval = setInterval(() => {
    currentTime.value = updateCurrentTime()
  }, 1000)
  
  // 获取教师信息
  async function fetchTeacherInfo() {
    try {
      const data = await fetchTeacherData()
      teacherInfo.value = data
    } catch (error) {
      console.error('获取教师信息失败:', error)
    }
  }
  
  // 页面加载时获取数据
  onMounted(() => {
    fetchTeacherInfo()
  })
  
  // 组件卸载时清除定时器
  onUnmounted(() => {
    clearInterval(timeInterval)
  })
  </script>
  
  <style scoped>
  .panel-card {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  }
  
  .teacher-info {
    padding: 15px 20px;
  }
  
  .info-cards {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
  }
  
  .info-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 10px;
  }
  
  .info-icon {
    font-size: 24px;
    color: #2E75B6;
    margin-bottom: 8px;
  }
  
  .info-value {
    font-size: 20px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 4px;
  }
  
  .info-label {
    font-size: 12px;
    color: #909399;
  }
  
  .info-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .info-item {
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  
  .info-item .info-label {
    color: #606266;
    margin-right: 8px;
    font-size: 14px;
  }
  
  .info-item .info-value {
    color: #303133;
    font-weight: 500;
    font-size: 14px;
    margin: 0;
  }
  </style>
  
  