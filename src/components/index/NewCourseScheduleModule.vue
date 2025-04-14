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
import { ElMessage, ElLoading } from 'element-plus'
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
  
  // 根据当前视图类型计算日期范围
  if (currentView.value === 'dayGridMonth') {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    return `${year}年${month}月`
  } else if (currentView.value === 'timeGridDay') {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  } else {
    // 周视图
    const dayOfWeek = date.getDay()
    const monday = new Date(date)
    monday.setDate(date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))
    const sunday = new Date(date)
    sunday.setDate(date.getDate() + (7 - dayOfWeek) - (dayOfWeek === 0 ? 7 : 0))
    
    const formatDate = (date: Date) => {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    }
    
    return `${formatDate(monday)} – ${formatDate(sunday)}`
  }
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

// 修改 fetchCalendarEvents 函数
async function fetchCalendarEvents() {
  try {
    const loading = ElLoading.service({
      target: '.calendar-wrapper',
      text: '加载课表中...',
      background: 'rgba(255, 255, 255, 0.7)'
    })
    
    // 调用API获取数据，传入当前日期和可能的课表类型
    const courses = await fetchCourseData(currentDate.value)
    console.log('获取到的课程数据:', courses)
    
    loading.close()
    
    if (!courses || courses.length === 0) {
      console.log('未获取到课程数据')
      ElMessage.info('当前没有课程安排')
      return []
    }
    
    const events: CalendarEvent[] = courses.map((course: any) => {
      try {
        // 获取当前周的日期
        const weekStart = new Date(selectedWeekRange.value[0])
        const courseDate = new Date(weekStart)
        
        // 确保day是有效值
        const day = typeof course.day === 'number' ? course.day : 0
        courseDate.setDate(weekStart.getDate() + day)
        
        // 确保时间格式正确
        const formatTime = (timeStr: string) => {
          // 如果时间格式已经是HH:MM:SS，直接返回
          if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) return timeStr
          // 如果时间格式是HH:MM，添加秒
          if (/^\d{2}:\d{2}$/.test(timeStr)) return `${timeStr}:00`
          // 其他情况，返回默认值
          return '08:00:00'
        }
        
        const startTime = formatTime(course.startTime || '08:00')
        const endTime = formatTime(course.endTime || '09:40')
        
        // 格式化日期和时间
        const startDateTime = `${courseDate.toISOString().split('T')[0]}T${startTime}`
        const endDateTime = `${courseDate.toISOString().split('T')[0]}T${endTime}`
        
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
          id: (course.id || Math.random().toString(36).substr(2)).toString(),
          title: course.name || '未命名课程',
          start: startDateTime,
          end: endDateTime,
          backgroundColor,
          borderColor,
          extendedProps: {
            location: course.location || '未指定地点',
            type: course.type || 'lecture'
          }
        }
      } catch (courseError) {
        console.error('处理单个课程数据时出错:', courseError, course)
        return null
      }
    }).filter(Boolean) // 过滤掉处理失败的课程
    
    return events
  } catch (error) {
    console.error('获取日历事件失败:', error)
    ElMessage.error('加载课表失败，请稍后重试')
    return []
  }
}

// 修改日历配置
const calendarOptions = reactive({
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
  initialView: 'timeGridWeek',
  height: '100%',
  locale: zhCn,
  selectable: true,
  editable: false,
  allDaySlot: false,
  slotMinTime: '08:00:00',
  slotMaxTime: '22:00:00',
  headerToolbar: {
    left: '',
    center: '',
    right: ''
  },
  // customButtons: {
  //   myCustomButton: {
  //     text: '看板',
  //     click: () => {
  //       isWeekViewVisible.value = true
  //       updateWeekViewData()
  //     }
  //   }
  // },
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
  },
  // 添加视图特定配置
  views: {
    dayGridMonth: {
      // 月视图特定配置
      dayMaxEvents: 3, // 限制每天显示的事件数，超出显示"+更多"
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }
    },
    timeGridWeek: {
      // 周视图特定配置
      slotDuration: '00:30:00',
      slotLabelInterval: '01:00'
    },
    timeGridDay: {
      // 日视图特定配置
      slotDuration: '00:30:00',
      slotLabelInterval: '01:00'
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
  currentDate.value = api.getDate() // 更新当前日期，确保日期范围显示正确
  updateCalendarEvents()
}
// 更新日历事件
async function updateCalendarEvents() {
  try {
    const events = await fetchCalendarEvents()
    const api = calendarRef.value?.getApi()
    if (!api) return
    
    api.removeAllEvents()
    if (events && events.length > 0) {
      events.forEach(event => {
        api.addEvent(event)
      })
    }
  } catch (error) {
    console.error('更新日历事件失败:', error)
    ElMessage.error('加载课表失败，请稍后重试')
  }
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
    currentView.value = calendarApi.view.type // 确保视图类型同步
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
  height: 100% !important; /* 保留这一行，删除后面冲突的设置 */
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

/* 特殊样式:当天高亮 */
.fc-col-header-cell.fc-day-today {
  background-color: #f0f7ff;
}

.fc-col-header-cell.fc-day-today .fc-col-header-cell-cushion {
  color: #2E75B6;
  font-weight: bold;
}

/* 月视图中的样式调整 */
.fc-dayGridMonth-view .fc-daygrid-day {
  height: 80px; /* 增加日期单元格高度 */
}

.fc-dayGridMonth-view .fc-daygrid-day-number {
  padding: 4px 8px;
  font-weight: 500;
}

.fc-dayGridMonth-view .fc-daygrid-day.fc-day-today {
  background-color: #f0f7ff;
}

.fc-dayGridMonth-view .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
  background-color: #2E75B6;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  overflow: auto; /* 移除 !important，允许 FullCalendar 管理滚动 */
}

.fc .fc-scroller-harness {
  position: relative;
  overflow: hidden;
  direction: ltr;
}

/* 添加月视图中"更多"按钮的样式 */
.fc-daygrid-more-link {
  color: #2E75B6;
  font-weight: 500;
}

.fc-daygrid-more-link:hover {
  text-decoration: underline;
}

/* 加载状态样式 */
.el-loading-mask {
  z-index: 1000;
}

/* 修复视图按钮组样式 */
.view-options .el-radio-button__inner {
  padding: 8px 15px;
}

/* 确保日视图和月视图下的事件样式保持一致 */
.fc-daygrid-event {
  margin-top: 1px;
  margin-bottom: 1px;
}
</style>