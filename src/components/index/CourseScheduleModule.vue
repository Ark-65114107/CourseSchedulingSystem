<template>
    <div class="panel-card schedule-card">
      <div class="panel-header">
        <h2>课表</h2>
        <div class="schedule-controls">
          <el-button-group>
            <el-button size="small" @click="previousWeek">
              <el-icon><ArrowLeft /></el-icon>
            </el-button>
            <el-button size="small" @click="nextWeek">
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </el-button-group>
          <el-button size="small" @click="goToToday">今天</el-button>
          <span class="date-range">{{ currentDateRange }}</span>
          <div class="view-options">
            <el-radio-group v-model="viewType" size="small">
              <el-radio-button label="month">月</el-radio-button>
              <el-radio-button label="week">周</el-radio-button>
              <el-radio-button label="day">日</el-radio-button>
              <el-radio-button label="list">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="panel-content">
        <!-- 使用课表组件 -->
        <CourseSchedule 
          :courses="courses" 
          :currentWeek="currentWeek"
          :viewType="viewType"
        />
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue'
  import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
  import CourseSchedule from '@/components/CourseSchedule.vue'
  import { fetchCourseData } from '@/api/courses.index'
  
  // 视图类型
  const viewType = ref('week')
  
  // 当前周次
  const currentWeek = ref(new Date())
  
  // 课程数据
  const courses = ref()
  
  // 当前日期范围
  const currentDateRange = computed(() => {
    const startDate = new Date(currentWeek.value)
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1) // 设置为周一
    
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 6) // 设置为周日
    
    const formatDate = (date: Date) => {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    }
    
    return `${formatDate(startDate)} – ${formatDate(endDate)}`
  })
  
  // 获取课程数据
  async function fetchCourses() {
    try {
      // 调用API获取课程数据
      const data = await fetchCourseData(currentWeek.value)
      courses.value = data
    } catch (error) {
      console.error('获取课程数据失败:', error)
    }
  }
  
  // 上一周
  function previousWeek() {
    const newDate = new Date(currentWeek.value)
    newDate.setDate(newDate.getDate() - 7)
    currentWeek.value = newDate
    fetchCourses()
  }
  
  // 下一周
  function nextWeek() {
    const newDate = new Date(currentWeek.value)
    newDate.setDate(newDate.getDate() + 7)
    currentWeek.value = newDate
    fetchCourses()
  }
  
  // 回到今天
  function goToToday() {
    currentWeek.value = new Date()
    fetchCourses()
  }
  
  // 页面加载时获取数据
  onMounted(() => {
    fetchCourses()
  })
  </script>
  
  <style scoped>
  .panel-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
    height:100px;
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
    height: 350px;
  }
  
  .schedule-card {
    flex: 1;
  }
  
  .schedule-controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .date-range {
    margin: 0 10px;
    font-weight: 500;
  }
  </style>
  
  