<template>
  <el-dialog
    v-model="isDialogVisiable"
    title="自动排课"
    width="800px"
    class="dialog"
    :close-on-click-modal="false"
    :show-close="false"
    @close="ClearInput"
  >
    <el-text class="taskTitle">任务数:~</el-text>
    <div class="AiMainDiv">
      <div class="classTree">
        <el-text class="classTreeTitle">选择要自动排课的班级</el-text>
        <el-button
          class="UniformSettings"
          type="primary"
          size="small"
          @click="UniformSettings"
          >统一设置</el-button
        >

        <el-input
          v-model="treeKeyword"
          placeholder="搜索班级"
          size="small"
          clearable
        ></el-input>
        <el-scrollbar
          class="classTreeScrollBar"
          height="340px"
          v-loading="isLoading"
          always
        >
          <el-tree
            :data="classTree"
            :filter-node-method="treeFilter"
            v-loading="isTreeLoading"
            ref="treeRef"
            node-key="id"
            default-expand-all
            @node-click="HandleTreeNodeClick"
            @check-change="HandleCheckChange"
            :props="{ class: nodeClass }"
            show-checkbox
            highlight-current
          >
            <template #default="{ node, data }">
              <div class="treeNode">
                <el-text v-if="data.select" style="font-weight: bold">{{
                  node.label
                }}</el-text>
                <el-text v-else>{{ node.label }}</el-text>
                <el-text v-if="data.select">({{ data.courseNum }})</el-text>
              </div>
            </template>
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="settingMenu" v-loading="isSettingMenuLoading">
        <el-text class="classTitle">{{ currentClassName }}</el-text>
        <el-scrollbar height="370px" ref="scrollBarRef">
          <el-form label-position="">
            <el-form-item label="是否参与自动排课:"
              ><el-switch
                v-model="isAutoSchedulingEnabled"
                @change="HandleSwitchChange"
            /></el-form-item>

            <el-form-item>
              <el-checkbox
                label="班级排课教室尽量集中:"
                v-model="isClassroomsConcentratedForClasses"
                :disabled="!isAutoSchedulingEnabled"
              />
            </el-form-item>

            <el-form-item
              ><el-checkbox
                v-model="isClassroomsConcentratedForTeachers"
                label="教师排课教室尽量集中"
                :disabled="!isAutoSchedulingEnabled"
            /></el-form-item>
            <el-form-item
              ><el-checkbox
                label="同一课程使用相同教室"
                v-model="isSameClassroomForSameCourse"
                :disabled="!isAutoSchedulingEnabled"
            /></el-form-item>
            <el-form-item
              ><el-checkbox
                label="体育课安排是否只能在下午"
                v-model="allowPEOnlyInAfternoon"
                :disabled="!isAutoSchedulingEnabled"
            /></el-form-item>
            <el-form-item
              ><el-checkbox
                label="体育课后是否安排课程"
                v-model="allowCoursesAfterPE"
                :disabled="!isAutoSchedulingEnabled"
            /></el-form-item>
            <el-form-item
              ><el-checkbox
                label="实验课程是否只能安排在晚上"
                v-model="isLabCourseEveningOnly"
                :disabled="!isAutoSchedulingEnabled"
            /></el-form-item>
            <el-form-item
              ><el-checkbox
                label="多学时（理论、实验、上机）类型的课程学时是否连续排"
                v-model="isContinuousSchedulingForMultiHours"
                :disabled="!isAutoSchedulingEnabled"
            /></el-form-item>
            <el-form-item
              ><el-checkbox
                label="自动排课是否需要安排地点"
                :disabled="!isAutoSchedulingEnabled"
                v-model="isLocationAssignmentRequired"
            /></el-form-item>
            <el-form-item
              ><el-checkbox
                label="学校晚上是否上课"
                :disabled="!isAutoSchedulingEnabled"
                v-model="isEveningClassesEnabled"
            /></el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </div>
    <template #footer>
      <el-button @click="HandleCancelClick" type="danger">取消</el-button>
      <el-button @click="HandleCancelClick" type="primary"
        >开始自动排课</el-button
      >
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, reactive, ref, toRefs, watch } from "vue";
import bus from "@/bus/bus";
import { getClassTreeApi } from "@/api/schedule/addClass/classTree.api";

export default {
  name: "AiScheduleDialog",
  setup() {
    const data = reactive({
      isDialogVisiable: false, //是否弹窗
      firstSelectClassId: "",
      id: "",
      mode: false,
    });

    const formInput = reactive({
      isAutoSchedulingEnabled: false, //是否参与自动排课
      isLocationAssignmentRequired: false, //自动排课是否需要安排地点
      isEveningClassesEnabled: false, //学校晚上是否上课
      isClassroomsConcentratedForClasses: false, //班级排课教室尽量集中
      isClassroomsConcentratedForTeachers: false, //教师排课教室尽量集中
      isSameClassroomForSameCourse: false, //同一课程是否使用相同教室
      allowPEOnlyInAfternoon: false, //体育课安排是否只能在下午
      allowCoursesAfterPE: false, //体育课后是否安排课程
      isLabCourseEveningOnly: false, //实验课程是否只能安排在晚上
      isContinuousSchedulingForMultiHours: false, //多学时（理论、实验、上机）类型的课程学时是否连续排
      canNotBeEvenlyDivided: 1, //周学时无法被连排节次整除时的安排方式
    });

    const currentTab = ref("");

    const taskId = ref("");

    const treeKeyword = ref("");

    const classTree = ref([]);

    const isTreeLoading = ref(false);

    const currentClassId = ref("");

    const currentClassName = ref("");

    const isSettingMenuLoading = ref(false);

    const scrollBarRef = ref();
    const treeRef = ref();

    onMounted(() => {
      bus.on("showAiScheduleDialog", (busData) => {
        currentClassId.value = busData.currentClassId;
        currentClassName.value = busData.currentClassName;
        taskId.value = busData.taskId;
        data.isDialogVisiable = true; //List中按下按钮弹窗
        getClassTree();
      });
    });

    watch(currentClassId, (value) => {
      console.log(value);
    });

    const treeFilter = (value, data) => {
      if (!value) return true;
      return data.label.includes(value);
    };

    const getClassTree = () => {
      isTreeLoading.value = true;
      return getClassTreeApi(taskId).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            classTree.value = res.data.tree;
            isTreeLoading.value = false;
          }
        }
      });
    };

    const getClassAiSetting = (classId) => {
      isSettingMenuLoading.value = true;
      setTimeout(() => {
        isSettingMenuLoading.value = false;
      }, 500);
    };

    const HandleTreeNodeClick = (node) => {
      if (node.select) {
        currentClassName.value = node.label;
        currentClassId.value = node.id;
        getClassAiSetting(currentClassId.value);
      }
    };

    const HandleCancelClick = () => {
      // teachingClassFormRef.value.resetFields();
      data.isDialogVisiable = false;
    };

    const HandleCheckChange = (node, isChecked) => {
      if (node.select) {
        console.log(node);
      }
    };

    const nodeClass = (node, b) => {
      return "nodeClass";
    };

    const UniformSettings = () => {
      currentClassName.value = "统一设置";
    };

    const HandleSwitchChange = () => {
      console.log(currentClassId.value);
      console.log(formInput.isAutoSchedulingEnabled);
      treeRef.value.setCheckedKeys([currentClassId.value],formInput.isAutoSchedulingEnabled);
    };

    return {
      ...toRefs(data),
      ...toRefs(formInput),
      HandleCancelClick,
      treeKeyword,
      classTree,
      treeFilter,
      isTreeLoading,
      getClassTree,
      currentTab,
      nodeClass,
      currentClassName,
      HandleTreeNodeClick,
      isSettingMenuLoading,
      HandleCheckChange,
      UniformSettings,
      scrollBarRef,
      treeRef,
      HandleSwitchChange,
    };
  },
};
</script>

<style scoped>
.AiMainDiv {
  height: 450px;
  margin-top: 10px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
}

.AiTab {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: solid 1px #dcdfe6;
  display: flex;
}

.aiSettingDiv {
  width: auto;
  padding: 10px;
  border-radius: 8px;
  border: solid 1px #dcdfe6;
}
.classTree {
  width: 45%;
  height: auto;
  margin-right: 10px;
  border-radius: 8px;
  border: solid 1px #dcdfe6;
  display: flex;

  flex-direction: column;
  justify-content: left;
  padding: 10px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}
.settingMenu {
  width: 55%;
  padding: 20px;
  border-radius: 8px;
  border: solid 1px #dcdfe6;
  display: flex;
  flex-direction: column;
  justify-content: left;
}

.classTreeScrollBar {
  width: auto;
  height: 450px;
  padding: 5px;
}

.treeNode {
  white-space: pre-wrap;
  word-wrap: break-word;
}

:deep(.el-tree-node__content):has(.treeNode) {
  height: max-content;
}

.classTitle {
  width: 100%;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: bold;
  justify-self: left;
}

.taskTitle {
  font-size: 20px;
  font-weight: bold;
}
.UniformSettings {
  width: 100px;
  height: auto;
  margin-bottom: 5px;
}
</style>