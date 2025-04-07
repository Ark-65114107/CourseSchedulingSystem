<template>
  <div class="guide">
    <h1>课表查看</h1>
    <div class="choose-control">
      <el-cascader
        v-model="selectedValue"
        @change="handleChange"
        placeholder="选择要查看的课表"
        :options="options"
        filterable
        clearable
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
//调用api获取学期数据
import { getSemesterListApi } from '@/api/basicData/semester.api'
//调用api获取学院数据
import {getDepartmentListApi} from '@/api/basicData/departments.api'
//调用api获取专业数据
import {getMajorListApi} from '@/api/basicData/major.api'
//调用api获取班级数据
import {getClassListApi} from '@/api/basicData/class.api'

const selectedValue = ref([]);
const options = ref([]);
const selectedScheduleType = ref(''); // 添加选中课表类型变量

// 安全地提取数组数据的辅助函数 - 增强版
function safeGetArray(response: any): any[] {
  if (!response) return [];
  
  // 直接是数组情况
  if (Array.isArray(response)) return response;
  
  // 常见的响应结构
  if (response.data && Array.isArray(response.data)) return response.data;
  if (response.records && Array.isArray(response.records)) return response.records;
  if (response.content && Array.isArray(response.content)) return response.content;
  if (response.items && Array.isArray(response.items)) return response.items;
  if (response.list && Array.isArray(response.list)) return response.list;
  
  // 特别处理学期API的特殊结构
  if (response.data && response.data.semesters && Array.isArray(response.data.semesters)) {
    console.log('找到学期数据在data.semesters中');
    return response.data.semesters;
  }
  
  // 遍历对象查找第一个数组类型属性
  for (const key in response) {
    if (Array.isArray(response[key])) {
      console.log(`找到数组属性: ${key}`);
      return response[key];
    }
    
    // 检查下一级属性
    if (typeof response[key] === 'object' && response[key] !== null) {
      for (const subKey in response[key]) {
        if (Array.isArray(response[key][subKey])) {
          console.log(`找到嵌套数组属性: ${key}.${subKey}`);
          return response[key][subKey];
        }
      }
    }
  }
  
  // 如果什么都没找到，返回空数组
  console.warn('未找到任何数组数据');
  return [];
}

// 深度搜索对象中的数组
function findArrayInObject(obj, depth = 0, maxDepth = 3) {
  // 防止过深递归
  if (depth > maxDepth) return null;
  
  // 如果是数组且不为空，返回它
  if (Array.isArray(obj) && obj.length > 0) return obj;
  
  // 如果是对象，搜索它的所有属性
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      const result = findArrayInObject(obj[key], depth + 1, maxDepth);
      if (result) return result;
    }
  }
  
  return null;
}

onMounted(async () => {
  try {
    // 显示加载中状态
    const loading = ElLoading.service({
      lock: true,
      text: '加载数据中...',
      background: 'rgba(255, 255, 255, 0.7)'
    });
    
    console.log('获取学期数据...');
    // 1. 获取学期数据
    const semesterResponse = await getSemesterListApi({ keyword: '', page: 1, size: 10 });
    console.log('学期API响应结构:', Object.keys(semesterResponse || {}));
    if (semesterResponse?.data) {
      console.log('data属性内容结构:', Object.keys(semesterResponse.data || {}));
    }
    
    // 尝试提取学期列表 - 使用多种方法
    let semesterList = safeGetArray(semesterResponse);
    if (semesterList.length === 0) {
      // 尝试通过深度搜索找到数组
      const deepSearchResult = findArrayInObject(semesterResponse);
      if (deepSearchResult && deepSearchResult.length > 0) {
        semesterList = deepSearchResult;
        console.log('通过深度搜索找到学期数据:', semesterList);
      }
    }
    
    console.log(`提取的学期列表(${semesterList.length}条):`, semesterList);
    
    if (semesterList.length === 0) {
      // 创建模拟数据以继续开发
      semesterList = [
        { id: 's1', name: '2023-2024-1学期', semester: '2023-2024第一学期' },
        { id: 's2', name: '2023-2024-2学期', semester: '2023-2024第二学期' }
      ];
      console.warn('使用模拟学期数据进行开发');
    }
    
    console.log('获取学院数据...');
    // 2. 获取学院数据
    const departmentResponse = await getDepartmentListApi({ keyword: '', page: 1, size: 10 });
    console.log('学院API响应结构:', Object.keys(departmentResponse || {}));
    let departmentList = safeGetArray(departmentResponse);
    
    // 如果没有找到数据，使用深度搜索
    if (departmentList.length === 0) {
      const deepSearchResult = findArrayInObject(departmentResponse);
      if (deepSearchResult && deepSearchResult.length > 0) {
        departmentList = deepSearchResult;
        console.log('通过深度搜索找到学院数据:', departmentList);
      }
    }
    
    console.log(`提取的学院列表(${departmentList.length}条):`, departmentList);
    
    // 如果学院数据为空，创建模拟数据
    if (departmentList.length === 0) {
      departmentList = [
        { id: 'd1', name: '计算机学院' },
        { id: 'd2', name: '机械学院' }
      ];
      console.warn('使用模拟学院数据进行开发');
    }
    
    console.log('获取专业数据...');
    // 3. 获取专业数据
    const majorResponse = await getMajorListApi({ keyword: '', page: 1, size: 10 });
    console.log('专业API响应结构:', Object.keys(majorResponse || {}));
    let majorList = safeGetArray(majorResponse);
    
    // 如果没有找到数据，使用深度搜索
    if (majorList.length === 0) {
      const deepSearchResult = findArrayInObject(majorResponse);
      if (deepSearchResult && deepSearchResult.length > 0) {
        majorList = deepSearchResult;
        console.log('通过深度搜索找到专业数据:', majorList);
      }
    }
    
    console.log(`提取的专业列表(${majorList.length}条):`, majorList);
    
    // 如果专业数据为空，创建模拟数据
    if (majorList.length === 0) {
      majorList = [
        { id: 'm1', name: '计算机科学与技术', departmentId: 'd1' },
        { id: 'm2', name: '软件工程', departmentId: 'd1' },
        { id: 'm3', name: '机械设计制造', departmentId: 'd2' }
      ];
      console.warn('使用模拟专业数据进行开发');
    }
    
    console.log('获取班级数据...');
    // 4. 获取班级数据
    const classResponse = await getClassListApi({ keyword: '', page: 1, size: 10 });
    console.log('班级API响应结构:', Object.keys(classResponse || {}));
    let classList = safeGetArray(classResponse);
    
    // 如果没有找到数据，使用深度搜索
    if (classList.length === 0) {
      const deepSearchResult = findArrayInObject(classResponse);
      if (deepSearchResult && deepSearchResult.length > 0) {
        classList = deepSearchResult;
        console.log('通过深度搜索找到班级数据:', classList);
      }
    }
    
    console.log(`提取的班级列表(${classList.length}条):`, classList);
    
    // 如果班级数据为空，创建模拟数据
    if (classList.length === 0) {
      classList = [
        { id: 'c1', name: '计科2101班', majorId: 'm1' },
        { id: 'c2', name: '计科2102班', majorId: 'm1' },
        { id: 'c3', name: '软工2101班', majorId: 'm2' },
        { id: 'c4', name: '机械2101班', majorId: 'm3' }
      ];
      console.warn('使用模拟班级数据进行开发');
    }
    
    console.log('构建级联选择器数据...');
    // 5. 构建级联选择器数据，使用更安全的方式
    try {
      // 创建一个临时数组来存储选项
      const tempOptions = [];
      
      // 遍历学期并构建选项
      for (const semester of semesterList) {
        const semesterOption = {
          value: semester.id,
          label: semester.semester || semester.name || `学期${semester.id}`,
          children: []
        };
        
        // 添加学院选项
        for (const department of departmentList) {
          const departmentOption = {
            value: department.id,
            label: department.name || `学院${department.id}`,
            children: []
          };
          
          // 筛选该学院下的所有专业
          // const majorsInDepartment = majorList.filter(
          //   major => major && major.departmentId === department.id
          // );
          
          // 添加专业选项
          for (const major of majorList) {
            const majorOption = {
              value: major.id,
              label: major.name || `专业${major.id}`,
              children: []
            };
            
            // 筛选该专业下的所有班级
           // const classesInMajor = classList.filter(
            //  cls => cls && cls.majorId === major.id
            //);
            // 添加班级选项
            for (const cls of classList) {
              majorOption.children.push({
                value: cls.id,
                label: cls.name || `班级${cls.id}`
              });
            }
            
            // 即使没有班级，也添加专业
            departmentOption.children.push(majorOption);
          }
          
          // 即使没有专业，也添加学院
          semesterOption.children.push(departmentOption);
        }
        
        // 添加完整的学期选项
        tempOptions.push(semesterOption);
      }
      
      // 更新响应式数据
      options.value = tempOptions;
      console.log('级联选择器数据构建成功:', options.value);
      
    } catch (cascaderError) {
      console.error('构建级联选择器数据失败:', cascaderError);
      ElMessage.error('构建选择器数据失败: ' + cascaderError.message);
    }
    
    loading.close();
    
    // 初始化日历
    await nextTick();
    const calendarApi = calendarRef.value?.getApi();
    if (calendarApi) {
      calendarApi.updateSize();
      currentDate.value = calendarApi.getDate();
      await updateCalendarEvents(); // 初始化调用一次
      customizeTimeGridAxis(); // 应用自定义标签
    }
    window.addEventListener('resize', handleResize);
    
  } catch (error) {
    console.error('初始化数据失败:', error);
    ElMessage.error('加载数据失败: ' + (error.message || '未知错误'));
  }
});

// 处理选择变化
const handleChange = (value: any[]) => {
  console.log('选择的课表:', value);
  
  if (!value || value.length === 0) {
    selectedScheduleType.value = '';
  } else {
    // 将选中值转换为字符串路径
    selectedScheduleType.value = value.join('/');
  }
  
  // 更新日历事件
  updateCalendarEvents();
};

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
    // 如果没有选择课表类型，可以提前返回
    if (!selectedScheduleType.value) {
      console.log('未选择课表类型，不加载数据')
      return []
    }
    
    // 从 api.index 获取课程数据，传入当前日期和选中的课表类型
    console.log('获取课程数据，参数:', {
      date: currentDate.value,
      scheduleType: selectedScheduleType.value
    })
    
    const courses = await coursedata(currentDate.value, selectedScheduleType.value)
      .catch(error => {
        console.error('调用课程API失败:', error)
        return [] // 返回空数组而不是抛出错误
      })

    console.log('获取到的课程数据:', courses)
    if (!courses || courses.length === 0) {
      console.log('没有找到课程数据，或返回了空数组')
      return []
    }
    
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

// 简化版的自定义渲染时间轴标签函数
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
      // 计算适合的行高 (800px容器 - 头部约50px) / 12节课
      const rowHeight = Math.floor((800 - 50) / 12)
      
      // 处理所有行
      rows.forEach((row, index) => {
        if (index < periodMap.length) {
          // 保留前12个节次行，设置高度
          if (row.querySelector('.fc-timegrid-slot-label-cushion')) {
            row.style.height = `${rowHeight}px`
          }
        } else {
          // 隐藏第12节后的多余行
          row.style.display = 'none'
        }
      })
      
      // 确保最后一行没有底部边框
      if (rows.length >= periodMap.length) {
        const lastRow = rows[periodMap.length - 1]
        if (lastRow) {
          lastRow.style.borderBottom = 'none'
        }
      }
    }
    
    // 隐藏时间轴内的多余内容区域
    const timeGridContent = document.querySelector('.fc-timegrid-body')
    if (timeGridContent) {
      // 设置明确的高度，防止显示多余内容
      const totalHeight = periodMap.length * Math.floor((800 - 50) / 12)
      const timeGridHtml = timeGridContent as HTMLElement
      timeGridHtml.style.maxHeight = `${totalHeight}px`
      
      // 隐藏超出的内容
      timeGridHtml.style.overflow = 'hidden'
    }
    
    // 修复滚动行为
    const scrollContainer = document.querySelector('.fc-scroller-liquid-absolute')
    if (scrollContainer) {
      scrollContainer.scrollTop = 0 // 确保滚动到顶部
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

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style>
.guide {
  display: flex;
  height: 70px;
  align-items: center;
}
h1{
  width:60%;
}

.choose-control {
  width: 400px;
  margin-right: 20px;
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

/* 增加时间轴宽度，防止与周一列重叠 */
th.fc-timegrid-axis {
  width: 160px !important; 
}

/* 确保标签框架布局正确 */
td.fc-timegrid-slot-label {
  max-width: 160px; 
  width: 160px !important; 
  position: relative;
}

/* 确保时间轴内容不会溢出 */
.fc-timegrid-axis-cushion {
  max-width: 160px;
  overflow: hidden;
}

/* 添加以下样式，确保第一列和第二列之间有明确的分隔 */
.fc-timegrid-cols table {
  border-spacing: 0;
  border-collapse: separate;
}

/* 增强第一列与其他列的视觉分隔 */
.fc-timegrid-col.fc-day:first-child {
  border-left: 2px solid #ddd;
}

/* 确保事件不会溢出到时间轴列 */
.fc-timegrid-event-harness {
  margin-left: 2px;
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