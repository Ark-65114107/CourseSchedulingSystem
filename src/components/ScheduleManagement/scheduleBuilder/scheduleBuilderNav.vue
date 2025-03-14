<template>
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
        :active="step"
        finish-status="success"
        process-status="process"
        class="custom-steps"
      >
        <el-step
          title="选择班级"
          :icon="School"
          @click="HandleNavClick('addClass')"
        >
          <template #description> 选择需要排课的班级 </template>
        </el-step>
        <el-step
          title="课程选择"
          :icon="Files"
          @click="HandleNavClick('setCourse')"
        >
          <template #description> 为选择的班级添加课程 </template>
        </el-step>
        <el-step
          title="学时设置"
          :icon="Timer"
          @click="HandleNavClick('setCourseHour')"
        >
          <template #description> 为每个班级的课程设置学时</template>
        </el-step>
        <el-step
          title="教学班设置"
          :icon="FolderChecked"
          @click="HandleNavClick('setCourseClass')"
        >
          <template #description> 添加或设置教学班 </template>
        </el-step>
        <el-step
          title="排课设置"
          :icon="Loading"
          @click="HandleNavClick('addClass')"
        >
          <template #description> 设置排课条件 </template>
        </el-step>
        <el-step
          title="排课结果"
          :icon="CircleCheck"
          @click="HandleNavClick('addClass')"
        >
          <template #description> 查看和导出课表 </template>
        </el-step>
      </el-steps>
    </div>
  </div>

  <!-- <div class="content-container">
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
  <!-- <chooseclass v-model="selectedValue" />
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
  </div> -->
</template>

<script>
import {
  School,
  Files,
  Loading,
  CircleCheck,
  QuestionFilled,
  ArrowRight,
  Timer,
  FolderChecked,
} from "@element-plus/icons-vue";
import { computed, reactive, toRefs } from "vue";
import router from "@/router";
import { useRoute, useRouter } from "vue-router";
export default {
  name: "scheduleBuilderNav",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      id: "",
    });
    const step = computed(() => {
      switch (router.currentRoute.value.name) {
        case "addClass":
          return 0;
        case "setCourse":
          return 1;
        case "setCourseHour":
          return 2;
        case "setCourseClass":
          return 3;
        default:
          return -1;
      }
    });

    const HandleNavClick = (value) => {
      router.push({
        name: value,
        query: {
          id: route.query.id,
        },
      });
    };

    return {
      ...toRefs(data),
      step,
      Timer,
      School,
      Files,
      Loading,
      CircleCheck,
      QuestionFilled,
      ArrowRight,
      HandleNavClick,
      FolderChecked,
    };
  },
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
  margin-bottom: 10px;
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
  padding: 0px 20px;
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

.el-step {
  height: min-content;
}
</style>