<template>
  <div class="guide">
    <h1>课表查看</h1>
    <div class="choose-control">
      <el-cascader
        @change="handleChange"
        placeholder="选择要查看的课表"
        :options="options"
        filterable
      />
    </div>
  </div>
  <div class="panel-card schedule-card">
    <div class="panel-header">
      <h2>课表</h2>
    </div>
  </div>
  <div class="panel-content calendar-wrapper">
    <FullCalendar ref="calendarRef" :options="calendarOptions" />
  </div>
</template>

<script lang="ts" setup name="ShowSchedule">
import { ref, reactive, computed, onMounted, nextTick, onUnmounted } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import zhCn from '@fullcalendar/core/locales/zh-cn'
// 使用 api.index 中的方法
import { coursedata } from '@/api/api.index'

// 选择课表时触发的方法
function handleChange(value: string[]) {
  //监听选择的课表，根据筛选的数据进行数据刷新
  console.log('选择的课表:', value)
  // 存储当前选中的课表类型
  selectedScheduleType.value = value.join('/')
  updateCalendarEvents()
}

// 存储当前选中的课表类型
const selectedScheduleType = ref('')

// 级联选择器选项数据
const options = [
  {
    value: '1',
    label: '第1学期'
  },
  {
    value: '2',
    label: '第2学期'
  }
]

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

// 使用 api.index 中的 coursedata 方法获取数据
async function fetchCalendarEvents() {
  try {
    // 从 api.index 获取课程数据，传入当前日期和选中的课表类型
    const courses = await coursedata(currentDate.value, selectedScheduleType.value)
    
    if (!courses || courses.length === 0) {
      console.log('没有找到课程数据，或返回了空数组')
      return []
    }
    
    console.log('获取到的课程数据:', courses)
    
    const events: CalendarEvent[] = courses.map((course: any) => {
      // 获取当前周的开始日期（周一）
      const weekStart = new Date(selectedWeekRange.value[0])
      // 根据课程的星期几（0-6）设置具体日期
      const courseDate = new Date(weekStart)
      courseDate.setDate(weekStart.getDate() + course.day) // course.day 应该是 0-6
      
      // 格式化日期和时间为 ISO 格式的日期时间字符串
      const startDateTime = `${courseDate.toISOString().split('T')[0]}T${course.startTime}`
      const endDateTime = `${courseDate.toISOString().split('T')[0]}T${course.endTime}`
      
      // 根据课程类型设置不同背景色
      let backgroundColor = '#409eff' // 默认蓝色
      let borderColor = '#409eff'
      
      switch(course.type) {
        case 'lab':
          backgroundColor = '#67c23a' // 绿色
          borderColor = '#67c23a'
          break
        case 'seminar':
          backgroundColor = '#e6a23c' // 橙色
          borderColor = '#e6a23c'
          break
        case 'exam':
          backgroundColor = '#f56c6c' // 红色
          borderColor = '#f56c6c'
          break
        // 可以添加更多课程类型的颜色
      }
      
      // 返回格式化后的日历事件对象
      return {
        id: course.id.toString(),
        title: course.name,
        start: startDateTime,
        end: endDateTime,
        backgroundColor,
        borderColor,
        extendedProps: { 
          location: course.location || '未指定地点',
          type: course.type || 'lecture'
        }
      }
    })
    
    return events
  } catch (error) {
    console.error('获取日历事件失败:', error)
    // 当捕获到错误时，显示给用户一个友好的提示
    ElMessage.error('获取课表数据失败，请稍后重试')
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
  // 添加加载状态
  const loading = ElLoading.service({
    lock: true,
    text: '加载课表中...',
    background: 'rgba(255, 255, 255, 0.7)'
  })
  
  try {
    const events = await fetchCalendarEvents()
    const api = calendarRef.value?.getApi()
    if (!api) return
    api.removeAllEvents()
    events.forEach(event => api.addEvent(event))
    
    // 如果没有事件，显示提示
    if (events.length === 0) {
      ElMessage.info('当前没有课程安排')
    }
  } catch (error) {
    console.error('更新日历事件失败:', error)
    ElMessage.error('加载课表失败')
  } finally {
    // 无论成功失败都关闭加载状态
    loading.close()
  }
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
.guide {
  display: flex;
  height: 70px;
}
h1{
  width:60%;
}
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