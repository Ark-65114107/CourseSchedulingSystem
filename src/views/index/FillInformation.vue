<template>
  <div class="container mx-auto p-4">
    <!-- 通知编辑区域 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-medium">通知编辑</h2>
        <button 
          @click="addNotification"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          添加通知
        </button>
      </div>
      
      <div v-for="(notice, index) in notifications" :key="index" class="mb-4 p-4 bg-gray-50 rounded">
        <div class="flex justify-between items-start mb-2">
          <input 
            v-model="notice.title"
            class="flex-1 p-2 border rounded mr-2"
            placeholder="通知标题"
          />
          <button 
            @click="removeNotification(index)"
            class="text-red-500 hover:text-red-600"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <input 
          type="datetime-local"
          v-model="notice.datetime"
          class="w-full p-2 border rounded mb-2"
        />
      </div>
    </div>

    <!-- 教师信息编辑区域 -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-medium mb-4">教师信息编辑</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 基本信息 -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">教师姓名</label>
            <input 
              v-model="teacherInfo.name"
              class="w-full p-2 border rounded"
              placeholder="请输入教师姓名"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">总课程数量</label>
            <input 
              v-model.number="teacherInfo.totalCourses"
              type="number"
              class="w-full p-2 border rounded"
              min="0"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">今日课程数</label>
            <input 
              v-model.number="teacherInfo.todayCourses"
              type="number"
              class="w-full p-2 border rounded"
              min="0"
            />
          </div>
        </div>

        <!-- 状态信息 -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">在岗状态</label>
            <select 
              v-model="teacherInfo.status"
              class="w-full p-2 border rounded"
            >
              <option value="在岗">在岗</option>
              <option value="离岗">离岗</option>
              <option value="请假">请假</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">本周课程总数</label>
            <input 
              v-model.number="teacherInfo.weekCourses"
              type="number"
              class="w-full p-2 border rounded"
              min="0"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">学期状态</label>
            <select 
              v-model="teacherInfo.semesterStatus"
              class="w-full p-2 border rounded"
            >
              <option value="进行中">进行中</option>
              <option value="已结束">已结束</option>
              <option value="未开始">未开始</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 保存按钮 -->
      <div class="mt-6 flex justify-end">
        <button 
          @click="saveChanges"
          class="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          保存更改
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="FillInformation">
import { ref } from 'vue'

// 通知列表数据
const notifications = ref([
  {
    title: '关于2025年春季学期教学任务的通知',
    datetime: '2025-03-08T10:00'
  },
  {
    title: '请及时完成本学期教学评估工作',
    datetime: '2025-03-07T14:30'
  }
])

// 教师信息数据
const teacherInfo = ref({
  name: '张教授',
  totalCourses: 6,
  todayCourses: 2,
  status: '在岗',
  weekCourses: 12,
  semesterStatus: '进行中'
})

// 添加新通知
const addNotification = () => {
  notifications.value.unshift({
    title: '',
    datetime: new Date().toISOString().slice(0, 16)
  })
}

// 删除通知
const removeNotification = (index) => {
  notifications.value.splice(index, 1)
}

// 保存所有更改
const saveChanges = () => {
  // 这里可以添加保存到后端的逻辑
  console.log('保存的通知数据：', notifications.value)
  console.log('保存的教师信息：', teacherInfo.value)
  alert('更改已保存！')
}
</script>

<style scoped>
/* 添加任何需要的自定义样式 */
.container {
  max-width: 1200px;
}

input[type="datetime-local"] {
  color: #374151;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
}
</style>