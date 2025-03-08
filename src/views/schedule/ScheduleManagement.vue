<template>
<<<<<<< HEAD
  <scheduleTaskList/>
</template>

<script>
import scheduleTaskList from '@/components/ScheduleManagement/scheduleTask/scheduleTaskList.vue'
export default {
  name:"ScheduleManagement",
  components:{
    scheduleTaskList
=======
  <div class="index">
    <div class="guide">
      <div class="header">
        <h1>排课任务</h1>
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
            <template #description>
              选择需要排课的班级
            </template>
          </el-step>
          <el-step title="数据选择" :icon="Files">
            <template #description>
              选择课程和教师数据
            </template>
          </el-step>
          <el-step title="排课进行中" :icon="Loading">
            <template #description>
              系统正在生成课表
            </template>
          </el-step>
          <el-step title="排课结果" :icon="CircleCheck">
            <template #description>
              查看和导出课表
            </template>
          </el-step>
        </el-steps>
      </div>
    </div>


    <div class="content-container">
      <el-card v-show="active === 0" class="main-card" :body-style="{ padding: '20px' }">
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
        <choosedata/>
        <el-button style="margin-top: 12px" @click="next">下一步</el-button>
      </div>

      <div v-show="active === 2">
        <aiScheduling/>
        <el-button style="margin-top: 12px" @click="next">下一步</el-button>
      </div>

      <div v-show="active === 3">
        <el-button style="margin-top: 12px" @click="next">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  School, 
  Files, 
  Loading, 
  CircleCheck,
  QuestionFilled,
  ArrowRight
} from '@element-plus/icons-vue'
import chooseclass from '@/components/ManualScheduling/chooseclass.vue'
import choosedata from '@/components/ManualScheduling/choosedata.vue'
import aiScheduling from '@/components/ManualScheduling/aiScheduling.vue'

const active = ref(0)
const loading = ref(false)
const selectedValue = ref("")  // 定义为字符串类型
const canSave = ref(false)

// 计算是否可以进行下一步
const canProceed = computed(() => {
  return selectedValue.value.length > 0
})

// 下一步
const next = async () => {
  if (!canProceed.value) {
    ElMessage.warning('请至少选择一个班级')
    return
>>>>>>> 8681d4aaaab0cf71d75bfe78f9b7d5490c02f191
  }

}
</script>

<style>

</style>