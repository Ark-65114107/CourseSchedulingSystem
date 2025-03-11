<template>
  <div class="panel-card schedule-card">
    <div class="panel-header">
      <h2>课表</h2>
      <div class="schedule-controls">
        <el-button-group>
          <el-button size="small" @click="handleCalendarNav('prev')">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <el-button size="small" @click="handleCalendarNav('next')">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </el-button-group>
        <el-button size="small" @click="goToToday">今天</el-button>
        <span class="date-range">{{ currentDateRange }}</span>
        <div class="view-options">
          <el-radio-group v-model="currentView" size="small" @change="handleViewChange">
            <el-radio-button label="dayGridMonth">月</el-radio-button>
            <el-radio-button label="timeGridWeek">周</el-radio-button>
            <el-radio-button label="timeGridDay">日</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="panel-content calendar-wrapper">
      <!-- FullCalendar -->
      <FullCalendar
        ref="calendarRef"
        :options="calendarOptions"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import type { CalendarApi, EventApi } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import zhCn from '@fullcalendar/core/locales/zh-cn'
import dayjs from 'dayjs'
import { fetchCourseData } from '@/api/courses.index'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor?: string
  borderColor?: string
  extendedProps?: {
    location?: string
    type?: string
  }
}

interface WeekViewColumn {
  key: string
  title: string
  width?: number
}

const currentDate = ref<Date>(new Date())
const currentView = ref('timeGridWeek')
const isWeekViewVisible = ref(false)
const weekViewData = ref<Array<Record<string, any>>>([])
const weekViewColumns = ref<WeekViewColumn[]>([
  { key: 'ownUserName', title: '教师', width: 120 },
  { key: 'monday', title: '周一' },
  { key: 'tuesday', title: '周二' },
  { key: 'wednesday', title: '周三' },
  { key: 'thursday', title: '周四' },
  { key: 'friday', title: '周五' },
  { key: 'saturday', title: '周六' },
  { key: 'sunday', title: '周日' }
])
const calendarRef = ref()

// 当前日期范围
const currentDateRange = computed(() => {
  const date = new Date(currentDate.value)
  const dayOfWeek = date.getDay()
  const monday = new Date(date)
  monday.setDate(date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))
  const sunday = new Date(date)
  sunday.setDate(date.getDate() + (7 - dayOfWeek) - (dayOfWeek === 0 ? 7 : 0))
  
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }
  
  return `${formatDate(monday)} – ${formatDate(sunday)}`
})

const selectedWeekRange = computed(() => {
  const date = new Date(currentDate.value)
  const dayOfWeek = date.getDay()
  const monday = new Date(date)
  monday.setDate(date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))
  const sunday = new Date(date)
  sunday.setDate(date.getDate() + (7 - dayOfWeek) - (dayOfWeek === 0 ? 7 : 0))
  return [monday, sunday]
})

// 获取课程数据并转换为日历事件
async function fetchCalendarEvents() {
  try {
    const courses = await fetchCourseData(currentDate.value)
    const events: CalendarEvent[] = courses.map((course: any) => {
      // 获取当前周的日期
      const weekStart = new Date(selectedWeekRange.value[0])
      const courseDate = new Date(weekStart)
      courseDate.setDate(weekStart.getDate() + course.day)
      
      // 格式化日期和时间
      const startDateTime = `${courseDate.toISOString().split('T')[0]}T${course.startTime}:00`
      const endDateTime = `${courseDate.toISOString().split('T')[0]}T${course.endTime}:00`
      
      // 根据课程类型设置颜色
      let backgroundColor = '#409eff'
      let borderColor = '#409eff'
      
      if (course.type === 'lab') {
        backgroundColor = '#67c23a'
        borderColor = '#67c23a'
      } else if (course.type === 'seminar') {
        backgroundColor = '#e6a23c'
        borderColor = '#e6a23c'
      } else if (course.type === 'exam') {
        backgroundColor = '#f56c6c'
        borderColor = '#f56c6c'
      }
      
      return {
        id: course.id.toString(),
        title: `${course.name}`,
        start: startDateTime,
        end: endDateTime,
        backgroundColor,
        borderColor,
        extendedProps: {
          location: course.location,
          type: course.type
        }
      }
    })
    
    return events
  } catch (error) {
    console.error('获取日历事件失败:', error)
    return []
  }
}

// 修改日历配置
const calendarOptions = reactive({
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
  initialView: 'timeGridWeek',
  height: '100%', // 改为100%以填充容器
  locale: zhCn,
  selectable: true,
  editable: false,
  allDaySlot: false,
  slotMinTime: '08:00:00',
  slotMaxTime: '22:00:00',
  headerToolbar: {
    left: '',
    center: '',
    right: 'myCustomButton'
  },
  customButtons: {
    myCustomButton: {
      text: '看板',
      click: () => {
        isWeekViewVisible.value = true
        updateWeekViewData()
      }
    }
  },
  events: [] as CalendarEvent[],
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  },
  dayHeaderFormat: {
    weekday: 'short',
    month: 'numeric',
    day: 'numeric'
  },
  eventContent: (arg) => {
    const location = arg.event.extendedProps?.location || ''
    const timeText = arg.timeText
    
    return {
      html: `
        <div class="fc-event-custom-content">
          <div class="fc-event-title">${arg.event.title}</div>
          <div class="fc-event-location">${location}</div>
          <div class="fc-event-time">${timeText}</div>
        </div>
      `
    }
  }
})

// 处理日历导航
const handleCalendarNav = (action: 'prev' | 'next') => {
  const api = calendarRef.value?.getApi()
  if (!api) return

  action === 'prev' ? api.prev() : api.next()
  currentDate.value = api.getDate()
  updateCalendarEvents()
}

// 回到今天
const goToToday = () => {
  const api = calendarRef.value?.getApi()
  if (!api) return
  
  api.today()
  currentDate.value = api.getDate()
  updateCalendarEvents()
}

// 处理视图变化
const handleViewChange = (view: string) => {
  const api = calendarRef.value?.getApi()
  if (!api) return
  
  api.changeView(view)
  updateCalendarEvents()
}

// 更新日历事件
async function updateCalendarEvents() {
  const events = await fetchCalendarEvents()
  const api = calendarRef.value?.getApi()
  if (!api) return
  
  api.removeAllEvents()
  events.forEach(event => {
    api.addEvent(event)
  })
}

// 更新看板数据
function updateWeekViewData() {
  // 模拟看板数据
  weekViewData.value = [
    {
      ownUserName: '张教授',
      monday: [{ subject: '高等数学 (08:00-09:40)' }],
      tuesday: [],
      wednesday: [{ subject: '大学物理实验 (14:00-16:35)' }],
      thursday: [],
      friday: [{ subject: '程序设计基础 (10:00-11:40)' }],
      saturday: [],
      sunday: []
    }
  ]
}

onMounted(async () => {
  await nextTick()
  const calendarApi = calendarRef.value?.getApi()
  if (calendarApi) {
    calendarApi.updateSize()
    currentDate.value = calendarApi.getDate()
    updateCalendarEvents()
  }
})

// 监听当前日期变化
watch(currentDate, () => {
  updateCalendarEvents()
})

// 监听视图变化
watch(currentView, (newView) => {
  handleViewChange(newView)
})
</script>

<style>
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
  display: flex;
  align-items: center;
}

.panel-content {
  padding: 0;
}

.calendar-wrapper {
  height: 600px; /* 设置固定高度 */
  position: relative;
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

/* FullCalendar 样式覆盖 */
.fc {
  height: 100% !important;
}

.fc-theme-standard td, .fc-theme-standard th {
  border-color: #ebeef5;
}

.fc-theme-standard .fc-scrollgrid {
  border-color: #ebeef5;
}

.fc-col-header-cell {
  background-color: #f5f7fa;
  font-weight: 500;
  font-size: 14px;
  padding: 8px 0;
}

/* 调整时间槽的高度 */
.fc-timegrid-slot {
  height: 28px !important;
}

.fc-timegrid-slot-label {
  font-size: 12px;
  color: #909399;
}

.fc-event {
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: transform 0.3s;
}

.fc-event:hover {
  transform: scale(1.02);
  z-index: 10;
}

.fc-event-custom-content {
  padding: 3px 5px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.fc-event-title {
  font-weight: 500;
  white-space: pre-line;
  margin-bottom: 2px;
}

.fc-event-location {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2px;
}

.fc-event-time {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.9);
}

.fc-col-header-cell.fc-day-today {
  background-color: #f0f7ff;
}

.fc-col-header-cell.fc-day-today .fc-col-header-cell-cushion {
  color: #2E75B6;
  font-weight: bold;
}

.fc-timegrid-now-indicator-line {
  border-color: #f56c6c;
}

.fc-timegrid-now-indicator-arrow {
  border-color: #f56c6c;
  color: #f56c6c;
}

.fc-button-primary {
  background-color: #2E75B6;
  border-color: #2E75B6;
}

.fc-button-primary:hover {
  background-color: #1c5a9c;
  border-color: #1c5a9c;
}

.fc-button-active {
  background-color: #1c5a9c !important;
  border-color: #1c5a9c !important;
}

.fc-list-day-cushion {
  background-color: #f5f7fa !important;
}

.fc-list-event:hover td {
  background-color: #f0f7ff !important;
}

/* 确保滚动条正常显示 */
.fc .fc-scroller-liquid-absolute {
  position: absolute !important;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}

.fc .fc-scroller {
  overflow: auto !important;
}

.fc .fc-scroller-harness {
  position: relative;
  overflow: hidden;
  direction: ltr;
}
.fc{
  height: 100px;
}
</style>

