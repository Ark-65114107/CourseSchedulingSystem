<template>
  <!-- 日历 -->
    <el-dialog v-model="isWeekViewVisible" width="60%" class="week-view-dialog">
    <template #header>
      <h1>看板</h1>
    </template>
    <div class="dialog-content">
      <el-table 
        :data="weekViewData" 
        border 
        stripe 
        show-overflow-tooltip 
        height="680"
      >
        <el-table-column 
          v-for="col in weekViewColumns" 
          :key="col.key"
          :prop="col.key" 
          :label="col.title" 
          :width="col.width"
        >
          <template #default="scope">
            <div :class="{ 'flex items-center': col.key === 'ownUserName' }">
              <template v-if="col.key === 'ownUserName'">
                {{ scope.row[col.key] }}
              </template>
              <template v-else>
                <ul>
                  <li 
                    v-for="(item, index) in scope.row[col.key]" 
                    :key="index"
                    class="text-ellipsis whitespace-nowrap overflow-hidden"
                  >
                    <el-tooltip :content="item.subject" placement="top" effect="light">
                      {{ `${index + 1}.${item.subject}` }}
                    </el-tooltip>
                  </li>
                </ul>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>

  <!-- FullCalendar -->
  <FullCalendar
    ref="calendarRef"
    :options="calendarOptions"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import type { CalendarApi, EventApi } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import zhCn from '@fullcalendar/core/locales/zh-cn'
import dayjs from 'dayjs'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor?: string
  borderColor?: string
}

interface WeekViewColumn {
  key: string
  title: string
  width?: number
}

const currentDate = ref<Date>(new Date())
const isWeekViewVisible = ref(false)
const weekViewData = ref<Array<Record<string, any>>>([])
const weekViewColumns = ref<WeekViewColumn[]>([])
const calendarRef = ref<{ getApi: () => CalendarApi }>()
const dateRef = ref()

const selectedWeekRange = computed(() => {
  const date = new Date(currentDate.value)
  const dayOfWeek = date.getDay()
  const monday = new Date(date)
  monday.setDate(date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))
  const sunday = new Date(date)
  sunday.setDate(date.getDate() + (7 - dayOfWeek) - (dayOfWeek === 0 ? 7 : 0))
  return [monday, sunday]
})

const isDateInSelectedWeek = (date: Date) => {
  return date >= selectedWeekRange.value[0] && date <= selectedWeekRange.value[1]
}

const calendarOptions = reactive({
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
  initialView: 'timeGridDay',
  height: '780px',
  locale: zhCn,
  selectable: true,
  editable: true,
  allDaySlot: false,
  headerToolbar: {
    left: 'today prev next',
    center: 'title',
    right: 'myCustomButton dayGridMonth,timeGridWeek,timeGridDay'
  },
  customButtons: {
    myCustomButton: {
      text: '看板',
      click: () => {
        isWeekViewVisible.value = true
        updateWeekViewData()
      }
    }
  }
})

const handleCalendarNav = (action: 'prev-month' | 'next-month') => {
  const api = calendarRef.value?.getApi()
  if (!api) return

  action === 'prev-month' ? api.prev() : api.next()
  currentDate.value = api.getDate()
}

onMounted(() => {
  const calendarApi = calendarRef.value?.getApi()
  if (calendarApi) {
    calendarApi.updateSize()
    currentDate.value = calendarApi.getDate()
  }
})

function handleDateClick(date: Date) {
  console.log('Clicked date: ', date)
}

function formatCalendarHeader(date: Date) {
  return dayjs(date).format('YYYY-MM-DD')
}

function updateWeekViewData() {
  throw new Error('Function not implemented.')
}
</script>

<style scoped>
.is-week {
  background-color: #f0f9eb;
  border-radius: 4px;
}

.custom-calendar {
  height: 100px;
}
</style>
