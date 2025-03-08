<template>
  <div class="index">
    <div class="guide">
      <div class="header">
        <el-tooltip
          content="在这里您可以为班级进行排课管理，请按步骤操作"
          placement="right"
        >
          <el-icon class="help-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="steps-container">
        <el-steps
          :active="active"
          finish-status="success"
          process-status="process"
          class="custom-steps"
        >
          <el-step title="选择班级" :icon="School">
            <template #description> 选择需要排课的班级 </template>
          </el-step>
          <el-step title="数据选择" :icon="Files">
            <template #description> 选择课程和教师数据 </template>
          </el-step>
          <el-step title="排课进行中" :icon="Loading">
            <template #description> 系统正在生成课表 </template>
          </el-step>
          <el-step title="排课结果" :icon="CircleCheck">
            <template #description> 查看和导出课表 </template>
          </el-step>
        </el-steps>
      </div>
    </div>

    <div class="content-container">
      <el-card
        v-show="active === 0"
        class="main-card"
        :body-style="{ padding: '20px' }"
      >
        <template #header>
          <div class="card-header">
            <span>班级选择</span>
            <el-button type="primary" link @click="showHelp">
              查看帮助
            </el-button>
          </div>
        </template>

        <div class="chooseclass-container">
          <div class="chooseclass">
            <!-- 使用 v-model 绑定 -->
            <chooseclass v-model="selectedValue" />
          </div>
        </div>

        <div class="actions">
          <el-button
            type="primary"
            @click="next"
            :disabled="!canProceed"
            :loading="loading"
          >
            下一步
            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
        </div>
      </el-card>

      <div v-show="active === 1">
        <choosedata />
        <el-button style="margin-top: 12px" @click="next">下一步</el-button>
      </div>

      <div v-show="active === 2">
        <el-button style="margin-top: 12px" @click="next">下一步</el-button>
      </div>

      <div v-show="active === 3">
        <el-button style="margin-top: 12px" @click="next">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "scheduleBuilderNav",
};
</script>

<style>
.index {
  display: flex;
  flex-direction: column;
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.guide {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  color: #303133;
  font-size: 24px;
}

.help-icon {
  color: #909399;
  cursor: pointer;
  font-size: 20px;
  transition: color 0.3s;
}

.help-icon:hover {
  color: #409eff;
}

.steps-container {
  padding: 20px 60px;
}

.custom-steps :deep(.el-step__title) {
  font-size: 16px;
}

.custom-steps :deep(.el-step__description) {
  font-size: 13px;
}

.content-container {
  margin-top: 24px;
  padding: 0 60px;
}

.main-card {
  background-color: white;
  border-radius: 8px;
  transition: all 0.3s;
}

.main-card:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header span {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.chooseclass-container {
  min-height: 300px;
}

.chooseclass {
  width: 100%;
}

.actions {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

/* 添加一些响应式样式 */
@media screen and (max-width: 768px) {
  .content-container {
    padding: 0 20px;
  }

  .steps-container {
    padding: 20px;
  }

  .custom-steps :deep(.el-step__title) {
    font-size: 14px;
  }

  .custom-steps :deep(.el-step__description) {
    display: none;
  }
}
</style>