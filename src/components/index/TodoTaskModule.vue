<template>
  <div class="panel-card">
    <div class="panel-header">
      <h2>我的待办任务 <el-badge :value="todoTasks.length" :hidden="todoTasks.length === 0" class="badge" /></h2>
      <el-button type="text" class="refresh-btn" @click="fetchTodoTasks">
        <el-icon><Refresh /></el-icon>
      </el-button>
    </div>
    <div class="panel-content">
      <div v-if="todoTasks.length === 0" class="empty-tasks">
        暂无待办任务
      </div>
      <div v-else v-for="(task, index) in todoTasks" :key="index" class="task-item">
        <span>{{ task.title }}</span>
        <el-button type="primary" size="small" @click="handleTask(task.id)">处理</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { fetchTasks, handleTask as processTask } from '@/api/tasks.index.ts'

// 待办任务
const todoTasks = ref([])

// 获取待办任务
async function fetchTodoTasks() {
  try {
    // 调用API获取待办任务
    const data = await fetchTasks()
    todoTasks.value = data
  } catch (error) {
    console.error('获取待办任务失败:', error)
  }
}

// 处理待办任务
async function handleTask(taskId: number) {
  try {
    await processTask(taskId)
    // 刷新任务列表
    fetchTodoTasks()
  } catch (error) {
    console.error('处理任务失败:', error)
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchTodoTasks()
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
  display: flex;
  align-items: center;
}

.badge {
  margin-left: 8px;
}

.panel-content {
  max-height: 300px;
  overflow-y: auto;
  padding: 15px 20px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  background-color: #f5f7fa;
  margin-bottom: 10px;
}

.empty-tasks {
  text-align: center;
  color: #909399;
  padding: 20px 0;
}
</style>

