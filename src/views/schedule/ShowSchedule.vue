<template>
  <h1>课表查看</h1>
  <div class="panel-card schedule-card">
    <div class="panel-header">
      <h2>课表</h2>
    </div>
    <div class="panel-content calendar-wrapper">
      <FullCalendar ref="calendarRef" :options="calendarOptions" />
    </div>
  </div>
</template>

<script lang="ts" setup name="ShowSchedule">
import { ref, reactive, computed, onMounted, nextTick, onUnmounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import zhCn from '@fullcalendar/core/locales/zh-cn'
import { fetchCourseData } from '@/api/courses.index'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor?: string
  borderColor?: string
  extendedProps?: { location?: string; type?: string }
}

const currentDate = ref<Date>(new Date())
const calendarRef = ref()

const selectedWeekRange = computed(() => {
  const date = new Date(currentDate.value)
  const dayOfWeek = date.getDay()
  const monday = new Date(date)
  monday.setDate(date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))
  const sunday = new Date(date)
  sunday.setDate(date.getDate() + (7 - dayOfWeek) - (dayOfWeek === 0 ? 7 : 0))
  return [monday, sunday]
})

async function fetchCalendarEvents() {
  try {
    const courses = await fetchCourseData(currentDate.value)
    const events: CalendarEvent[] = courses.map((course: any) => {
      const weekStart = new Date(selectedWeekRange.value[0])
      const courseDate = new Date(weekStart)
      courseDate.setDate(weekStart.getDate() + course.day)

      const startDateTime = `${courseDate.toISOString().split('T')[0]}T${course.startTime}:00`
      const endDateTime = `${courseDate.toISOString().split('T')[0]}T${course.endTime}:00`

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
        extendedProps: { location: course.location, type: course.type }
      }
    })
    return events
  } catch (error) {
    console.error('获取日历事件失败:', error)
    return []
  }
}

const calendarOptions = reactive({
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
  initialView: 'timeGridWeek',
  height: '100%',
  locale: zhCn,
  selectable: true,
  editable: false,
  allDaySlot: false,
  slotMinTime: '08:10:00',
  slotMaxTime: '20:15:00',
  slotDuration: '00:45:00',
  headerToolbar: { left: '', center: '', right: '' },
  events: [] as CalendarEvent[],
  eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
  dayHeaderFormat: { weekday: 'short', month: 'numeric', day: 'numeric' },
  viewDidMount: handleViewChange,

  // 保持原始的slotLabelContent，防止标签完全消失
  slotLabelContent: (arg) => {
    const timeStr = arg.date.toTimeString().substring(0, 8)
    const sectionMap: Record<string, string> = {
      '08:10:00': '上午\n第1节',
      '08:55:00': '第2节',
      '09:40:00': '第3节',
      '10:35:00': '第4节',
      '11:20:00': '第5节',
      '13:30:00': '下午\n第6节',
      '14:15:00': '第7节',
      '15:05:00': '第8节',
      '15:50:00': '第9节',
      '18:00:00': '第10节',
      '18:45:00': '晚上\n第11节',
      '19:30:00': '第12节'
    }
    return sectionMap[timeStr] || ''
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

async function updateCalendarEvents() {
  const events = await fetchCalendarEvents()
  const api = calendarRef.value?.getApi()
  if (!api) return
  api.removeAllEvents()
  events.forEach(event => api.addEvent(event))
}

// 简化版的自定义渲染时间轴标签函数 - 修复节次显示问题
function customizeTimeGridAxis() {
  // 延迟执行以确保DOM已更新
  setTimeout(() => {
    // 获取所有时间轴单元格
    const timeSlotLabels = document.querySelectorAll('.fc-timegrid-slot-label-cushion')
    
    // 定义课程时间与节次映射
    const periodMap = [
      { time: '08:10', label: '上午<br>第1节<br>(08:10-08:50)' },
      { time: '08:55', label: '第2节<br>(08:55-09:35)' },
      { time: '09:40', label: '第3节<br>(09:40-10:20)' },
      { time: '10:35', label: '第4节<br>(10:35-11:15)' },
      { time: '11:20', label: '第5节<br>(11:20-12:00)' },
      { time: '13:30', label: '下午<br>第6节<br>(13:30-14:10)' },
      { time: '14:15', label: '第7节<br>(14:15-14:55)' },
      { time: '15:05', label: '第8节<br>(15:05-15:45)' },
      { time: '15:50', label: '第9节<br>(15:50-16:30)' },
      { time: '18:00', label: '晚上<br>第10节<br>(18:00-18:40)' },
      { time: '18:45', label: '第11节<br>(18:45-19:25)' },
      { time: '19:30', label: '第12节<br>(19:30-20:10)' }
    ]
    
    // 应用自定义标签 - 简单的替换HTML内容
    timeSlotLabels.forEach((el, index) => {
      if (index < periodMap.length) {
        el.innerHTML = periodMap[index].label
      }
    })
    
    // 调整行高 - 使所有行高度均匀
    const slotsContainer = document.querySelector('.fc-timegrid-slots tbody')
    if (slotsContainer) {
      const rows = slotsContainer.querySelectorAll('tr')
      // 计算适合的行高 (650px容器 - 头部约50px) / 12节课
      const rowHeight = Math.floor((650 - 50) / 12)
      rows.forEach(row => {
        if (row.querySelector('.fc-timegrid-slot-label-cushion')) {
          row.style.height = `${rowHeight}px`
        }
      })
    }
  }, 100)
}

// 处理视图变化时重新应用自定义标签
function handleViewChange() {
  customizeTimeGridAxis()
}

// 处理窗口大小变化
function handleResize() {
  const calendarApi = calendarRef.value?.getApi()
  if (calendarApi) {
    calendarApi.updateSize()
    customizeTimeGridAxis()
  }
}

onMounted(async () => {
  await nextTick()
  const calendarApi = calendarRef.value?.getApi()
  if (calendarApi) {
    calendarApi.updateSize()
    currentDate.value = calendarApi.getDate()
    await updateCalendarEvents()
    customizeTimeGridAxis() // 应用自定义标签
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
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
.panel-content {
  padding: 0;
}
.calendar-wrapper {
  height: 650px; /* 总高度可调 */
  position: relative;
}
.schedule-card { flex: 1; }
.fc {
  height: 100% !important;
}
.fc-theme-standard td, .fc-theme-standard th {
  border-color: #ebeef5;
}
.fc-theme-standard .fc-scrollgrid { border-color: #ebeef5; }
.fc-col-header-cell {
  background-color: #f5f7fa;
  font-weight: 500;
  font-size: 14px;
  padding: 8px 0;
}

/* 节次平均分布处理 - 简化版本 */
.fc-timegrid-slot {
  transition: height 0.3s ease; /* 高度变化时的平滑过渡 */
}

.fc-timegrid-slot-label {
  font-size: 12px;
  color: #606266;
  white-space: pre-line;  /* 支持换行显示 */
  vertical-align: middle;
  padding: 3px 2px;
}

/* 确保时间轴标签框架居中对齐 */
.fc-timegrid-slot-label-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%; /* 确保宽度正确 */
}

/* 增加时间轴宽度，但不要过宽 */
th.fc-timegrid-axis {
  width: 105px !important;
}

/* 时间轴标签样式优化 */
.fc-timegrid-slot-label-cushion {
  width: 100%;
  text-align: center;
  line-height: 1.2; /* 调整行高以容纳更多文本 */
  font-size: 11px; /* 稍微减小字体 */
}

/* 确保标签框架布局正确 */
td.fc-timegrid-slot-label {
  max-width: 105px;
  width: 105px !important;
  position: relative;
}

/* 为节次行添加边框 */
.fc-timegrid-slot:not(:last-child) {
  border-bottom: 1px solid #ebeef5;
}

/* 课程块样式 */
.fc-event {
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: transform 0.3s;
}
.fc-event:hover { transform: scale(1.02); z-index: 10; }
.fc-event-custom-content {
  padding: 3px 5px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.fc-event-title { font-weight: 500; white-space: pre-line; margin-bottom: 2px; }
.fc-event-location, .fc-event-time {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2px;
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
.fc-button-primary {
  background-color: #2E75B6;
  border-color: #2E75B6;
}
.fc-button-primary:hover {
  background-color: #1c5a9c;
  border-color: #1c5a9c;
}
</style>