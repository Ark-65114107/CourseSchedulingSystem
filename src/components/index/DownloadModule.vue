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
        v-if="downloads.length === 0 && !hasStaticFiles"
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
        
        <!-- 固定模板文件下载 -->
        <div class="download-item">
          <el-button type="text" @click="downloadTeachingTask">
            <el-icon><Document /></el-icon>
            <span>教学任务书模板</span>
          </el-button>
        </div>
        
        <div class="download-item">
          <el-button type="text" @click="downloadManual">
            <el-icon><Notebook /></el-icon>
            <span>教师手册2025版</span>
          </el-button>
        </div>
        
        <div class="download-item">
          <el-button type="text" @click="downloadImportTemplate">
            <el-icon><Grid /></el-icon>
            <span>课程表导入模板</span>
          </el-button>
        </div>
        
        <div class="download-item">
          <el-button type="text" @click="downloadScheduleExcel">
            <el-icon><Download /></el-icon>
            <span>课表下载(Excel)</span>
          </el-button>
        </div>
        
        <!-- <div class="download-item">
          <el-button type="text" @click="downloadSchedulePdf">
            <el-icon><Tickets /></el-icon>
            <span>课表下载(PDF)</span>
          </el-button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { 
  Download, 
  Refresh, 
  Document, 
  Notebook, 
  Grid, 
  Tickets 
} from '@element-plus/icons-vue'
import { 
  fetchDownloadFiles, 
  downloadFile as downloadSingleFile, 
  downloadSchedule,
  downloadTeachingTaskTemplate,
  downloadTeacherManual,
  downloadScheduleImportTemplate,
} from '@/api/downloads.index'
import { ElMessage } from 'element-plus'

// 下载文件列表
const downloads = ref([])

// 计算属性：是否有静态文件可以下载（即使API返回的动态文件列表为空）
const hasStaticFiles = computed(() => true) // 始终为true，因为我们有固定的模板文件

// 获取下载文件
async function fetchDownloads() {
  try {
    // 调用API获取下载文件
    const data = await fetchDownloadFiles()
    downloads.value = data
  } catch (error) {
    console.error('获取下载文件失败:', error)
    ElMessage.error('获取下载文件列表失败')
  }
}

// 下载文件
async function downloadFile(fileId: number) {
  try {
    await downloadSingleFile(fileId)
    ElMessage.success('文件下载成功')
  } catch (error) {
    console.error('下载文件失败:', error)
    ElMessage.error('下载文件失败，请稍后重试')
  }
}

// 下载Excel格式课表
async function downloadScheduleExcel() {
  try {
    await downloadSchedule('excel')
    ElMessage.success('课表已开始下载(Excel格式)')
  } catch (error) {
    console.error('下载Excel课表失败:', error)
    ElMessage.error('下载课表失败，请稍后重试')
  }
}

// 下载PDF格式课表
async function downloadSchedulePdf() {
  try {
    await downloadSchedule('pdf')
    ElMessage.success('课表已开始下载(PDF格式)')
  } catch (error) {
    console.error('下载PDF课表失败:', error)
    ElMessage.error('下载课表失败，请稍后重试')
  }
}

// 下载教学任务书模板函数
async function downloadTeachingTask() {
  try {
    await downloadTeachingTaskTemplate()
    ElMessage.success('教学任务书模板已开始下载')
  } catch (error) {
    console.error('下载教学任务书模板失败:', error)
    ElMessage.error('下载失败，请稍后重试')
  }
}

// 下载教师手册函数
async function downloadManual() {
  try {
    await downloadTeacherManual()
    ElMessage.success('教师手册已开始下载')
  } catch (error) {
    console.error('下载教师手册失败:', error)
    ElMessage.error('下载失败，请稍后重试')
  }
}

// 下载课程表导入模板函数
async function downloadImportTemplate() {
  try {
    await downloadScheduleImportTemplate()
    ElMessage.success('课程表导入模板已开始下载')
  } catch (error) {
    console.error('下载课程表导入模板失败:', error)
    ElMessage.error('下载失败，请稍后重试')
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
  font-weight: 500;
}

.panel-content {
  padding: 15px 20px;
}

.download-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.download-item {
  display: flex;
  align-items: center;
}

.download-item .el-button {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #606266;
}

.download-item .el-button:hover {
  color: #409EFF;
}

.download-item .el-icon {
  margin-right: 5px;
  font-size: 18px;
}

.refresh-btn {
  padding: 2px;
}
</style>