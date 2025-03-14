<template>
  <div class="panel-card">
    <div class="panel-header">
      <h2>下载</h2>
      <el-button type="text" class="refresh-btn" @click="fetchDownloads">
        <el-icon><Refresh /></el-icon>
      </el-button>
    </div>
    <div class="panel-content">
      <el-alert
        v-if="downloads.length === 0"
        title="暂时没有文件可以下载(ToT)"
        type="info"
        :closable="false"
        show-icon
      />
      <div v-else class="download-list">
        <div v-for="(download, index) in downloads" :key="index" class="download-item">
          <el-button type="text" @click="downloadFile(download.id)">
            <el-icon><Download /></el-icon>
            <span>{{ download.name }}</span>
          </el-button>
        </div>
      </div>
      <div class="download-item">
        <el-button type="text" @click="downloadSchedule">
          <el-icon><Download /></el-icon>
          <span>课表下载</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Download, Refresh } from '@element-plus/icons-vue'
import { fetchDownloadFiles, downloadFile as downloadSingleFile, downloadSchedule as downloadScheduleFile } from '@/api/downloads.index'

// 下载文件列表
const downloads = ref([])

// 获取下载文件
async function fetchDownloads() {
  try {
    // 调用API获取下载文件
    const data = await fetchDownloadFiles()
    downloads.value = data
  } catch (error) {
    console.error('获取下载文件失败:', error)
  }
}

// 下载文件
async function downloadFile(fileId: number) {
  try {
    await downloadSingleFile(fileId)
  } catch (error) {
    console.error('下载文件失败:', error)
  }
}

// 下载课表
async function downloadSchedule() {
  try {
    await downloadScheduleFile()
  } catch (error) {
    console.error('下载课表失败:', error)
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchDownloads()
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
}

.download-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.download-item {
  margin-top: 10px;
}

.download-item:first-child {
  margin-top: 0;
}

.download-item .el-button {
  display: flex;
  align-items: center;
  gap: 5px;
}

.download-item .el-icon {
  margin-right: 5px;
}
</style>

