<template>
  <div class="course-schedule">
    <!-- 课表头部 -->
    <div class="schedule-header">
      <div class="time-column"></div>
      <div 
        v-for="(day, index) in weekDays" 
        :key="index" 
        class="day-column"
        :class="{ 'today': isToday(day.date) }"
      >
        {{ day.name }}
      </div>
    </div>
    
    <!-- 课表内容 -->
    <div class="schedule-body">
      <div class="time-slots">
        <div 
          v-for="hour in timeSlots" 
          :key="hour.value" 
          class="time-slot"
        >
          <div class="time-label">{{ hour.label }}</div>
        </div>
      </div>
      
      <div class="schedule-grid">
        <!-- 课程项目 -->
        <div 
          v-for="course in courses" 
          :key="course.id"
          class="course-item"
          :style="getCourseStyle(course)"
          :class="getCourseClass(course)"
          @click="showCourseDetail(course)"
        >
          <div class="course-content">
            <div class="course-title">{{ course.name }}</div>
            <div class="course-location">{{ course.location }}</div>
            <div class="course-time">{{ formatCourseTime(course) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

// 定义课程类型
interface Course {
  id: number
  name: string
  location: string
  day: number // 0-6, 0 = 周一
  startTime: string // 格式: "HH:MM"
  endTime: string // 格式: "HH:MM"
  type: string // 课程类型，用于样式区分
}

// 定义组件属性
const props = defineProps({
  courses: {
    type: Array as () => Course[],
    default: () => []
  },
  currentWeek: {
    type: Date,
    default: () => new Date()
  },
  viewType: {
    type: String,
    default: 'week'
  }
})

// 时间槽
const timeSlots = ref([
  { value: 8, label: '08:00' },
  { value: 9, label: '09:00' },
  { value: 10, label: '10:00' },
  { value: 11, label: '11:00' },
  { value: 12, label: '12:00' },
  { value: 13, label: '13:00' },
  { value: 14, label: '14:00' },
  { value: 15, label: '15:00' },
  { value: 16, label: '16:00' },
  { value: 17, label: '17:00' },
  { value: 18, label: '18:00' },
  { value: 19, label: '19:00' },
  { value: 20, label: '20:00' },
  { value: 21, label: '21:00' }
])

// 计算周几
const weekDays = computed(() => {
  const days = []
  const currentDate = new Date(props.currentWeek)
  
  // 调整到本周的周一
  const monday = new Date(currentDate)
  monday.setDate(currentDate.getDate() - currentDate.getDay() + 1)
  
  // 生成周一到周日
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    
    days.push({
      name: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
      date: date
    })
  }
  
  return days
})

// 检查是否是今天
function isToday(date: Date): boolean {
  const today = new Date()
  return date.getDate() === today.getDate() && 
         date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear()
}

// 获取课程样式
function getCourseStyle(course: Course) {
  // 计算开始时间和结束时间对应的行
  const startHour = parseInt(course.startTime.split(':')[0])
  const startMinute = parseInt(course.startTime.split(':')[1])
  const endHour = parseInt(course.endTime.split(':')[0])
  const endMinute = parseInt(course.endTime.split(':')[1])
  
  // 计算开始行和结束行
  const startRow = (startHour - 8) + (startMinute / 60)
  const endRow = (endHour - 8) + (endMinute / 60)
  
  // 计算课程持续的行数
  const rowSpan = endRow - startRow
  
  return {
    gridRow: `${startRow + 1} / span ${rowSpan}`,
    gridColumn: `${course.day + 1}`,
  }
}

// 获取课程类名
function getCourseClass(course: Course) {
  return {
    [`course-type-${course.type}`]: true
  }
}

// 格式化课程时间
function formatCourseTime(course: Course) {
  return `${course.startTime} - ${course.endTime}`
}

// 显示课程详情
function showCourseDetail(course: Course) {
  ElMessage({
    message: `课程: ${course.name}, 地点: ${course.location}`,
    type: 'info'
  })
  // 这里可以添加显示课程详情的逻辑，例如打开一个对话框
}
</script>

<style scoped>
.course-schedule {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.schedule-header {
  display: flex;
  border-bottom: 1px solid #ebeef5;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
  height: 40px;
}

.time-column {
  width: 60px;
  flex-shrink: 0;
}

.day-column {
  flex: 1;
  text-align: center;
  padding: 8px;
  font-weight: 500;
  font-size: 14px;
  border-right: 1px solid #ebeef5;
}

.day-column.today {
  background-color: #f0f7ff;
  color: #2E75B6;
  font-weight: bold;
}

.schedule-body {
  position: relative;
  display: flex;
  height: 700px; /* 调整高度以适应更多时间槽 */
}

.time-slots {
  width: 60px;
  flex-shrink: 0;
}

.time-slot {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}

.time-label {
  font-size: 12px;
  color: #909399;
}

.schedule-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(14, 50px); /* 14个小时的时间槽 */
  position: relative;
  background-image: linear-gradient(#ebeef5 1px, transparent 1px);
  background-size: 100% 50px;
  border-right: 1px solid #ebeef5;
}

.course-item {
  margin: 2px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.course-item:hover {
  transform: scale(1.02);
  z-index: 2;
}

.course-content {
  padding: 5px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.course-title {
  font-weight: 500;
  font-size: 12px;
}

.course-location, .course-time {
  font-size: 10px;
  color: #606266;
}

/* 不同类型课程的样式 */
.course-type-lecture {
  background-color: #ecf5ff;
  border-left: 3px solid #409eff;
}

.course-type-lab {
  background-color: #f0f9eb;
  border-left: 3px solid #67c23a;
}

.course-type-seminar {
  background-color: #fdf6ec;
  border-left: 3px solid #e6a23c;
}

.course-type-exam {
  background-color: #fef0f0;
  border-left: 3px solid #f56c6c;
}
</style>

