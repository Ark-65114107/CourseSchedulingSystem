<template>
  <div class="panel-card">
    <div class="panel-header">
      <h2>通知</h2>
      <el-button type="text" class="refresh-btn" @click="fetchNotifications">
        <el-icon><Refresh /></el-icon>
      </el-button>
    </div>
    <div class="panel-content notification-content">
      <el-alert
        v-if="notifications.length === 0"
        title="暂时没有通知信息(ToT)"
        type="info"
        :closable="false"
        show-icon
      />
      <div v-else class="notification-list">
        <div v-for="(notification, index) in notifications" :key="index" class="notification-item">
          <div class="notification-content">{{ notification.content }}</div>
          <div class="notification-time">{{ notification.time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { fetchNotificationData } from '@/api/notifications.index'

// 通知列表
const notifications = ref([])
const loading = ref(false)

// 获取通知
async function fetchNotifications() {
  if (loading.value) return;
  
  loading.value = true;
  try {
    // 调用API获取通知信息
    const data = await fetchNotificationData()
    notifications.value = data
  } catch (error) {
    console.error('获取通知失败:', error)
  } finally {
    loading.value = false;
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchNotifications()
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

.panel-content {
  padding: 15px 20px;
  max-height: 300px;
  overflow-y: auto;
}

.notification-content {
  max-height: none;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification-item {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.notification-time {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
</style>

