<template>
  <el-dialog
    v-model="isDialogVisiable"
    title="自动排课"
    width="800px"
    class="dialog"
    :close-on-click-modal="false"
    @close="ClearInput"
  >
    <div class="scheduleSetting" v-show="!isScheduling">
      <el-text class="taskTitle">任务数:{{ classListLength }}</el-text>
      <div class="AiMainDiv">
        <div class="classTree">
          <el-text class="classTreeTitle">选择要自动排课的班级</el-text>

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
              @check-change="HandleCheckChange"
              :props="{ class: nodeClass }"
              show-checkbox
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
            <el-form label-position="left">
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
    </div>

    <!-- <div class="scheduling" v-show="isScheduling">
      <el-text class="schedulingTitle">自动排课中...</el-text><br />
      <div class="schedulingContent">
        <el-text class="schedulingText">排课进度</el-text>
      </div>
      <el-button @click="testimporve">+</el-button>
      <el-button @click="initAutoScheduleMessage">reset</el-button>
      <el-text type="info" size="small">AI模型为豆包1.5pro</el-text>
      <el-scrollbar class="chartScrollBar" height="375px">
        <div class="chatView">
          <div
            class="chatMessage"
            v-for="msg of autoSchedulingProgressMessage"
            v-show="msg.isShow"
          >
            <img class="chatAvatar" src="@/assets/aiLogo.png" />
            <div class="chatTextBorder">
              <el-text class="chatText"
                >{{ msg.message }}
                {{msg.errorMessage}}
                <div class="chatLoading" v-show="msg.isLoading"></div>
              </el-text>
              <el-progress
                class="chatProgress"
                v-show="msg.isProgressShow"
                :percentage="100"
              ></el-progress>
              <div v-show="msg.isResultShow" class="autoScheduleInfo">
                qwq
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div> -->
    <aiChatVue :isScheduling="true" />

    <template #footer>
      <el-button @click="HandleCancelClick" type="danger" v-show="!isScheduling"
        >取消</el-button
      >
      <el-button @click="HandleStartClick" type="primary" v-show="!isScheduling"
        >开始自动排课</el-button
      >
    </template>
  </el-dialog>
</template>

<script>
import { computed, onMounted, reactive, ref, toRefs, watch } from "vue";
import bus from "@/bus/bus";
import { getClassTreeApi } from "@/api/schedule/addClass/classTree.api";
import { getAutoScheduleClassListApi } from "@/api/schedule/aiSchedule/getAutoScheduleClassList.api.js";
import { setAutoScheduleSettingApi } from "@/api/schedule/aiSchedule/setAutoScheduleSetting.api.js";
import { ElMessage, ElMessageBox } from "element-plus";
import aiChatVue from '@/components/ScheduleManagement/scheduleBuilder/aiChat.vue';


export default {
  name: "AiScheduleDialog",
  components:{aiChatVue},
  setup() {
    const data = reactive({
      isDialogVisiable: false, //是否弹窗
      firstSelectClassId: "",
      id: "",
      mode: false,
    });

    const formInput = reactive({
      isAutoSchedulingEnabled: true, //是否参与自动排课
      isLocationAssignmentRequired: false, //自动排课是否需要安排地点
      isEveningClassesEnabled: false, //晚上是否上课
      isClassroomsConcentratedForClasses: false, //班级排课教室尽量集中
      isClassroomsConcentratedForTeachers: false, //教师排课教室尽量集中
      isSameClassroomForSameCourse: false, //同一课程是否使用相同教室
      allowPEOnlyInAfternoon: false, //体育课安排是否只能在下午
      allowCoursesAfterPE: false, //体育课后是否安排课程
      isLabCourseEveningOnly: false, //实验课程是否只能安排在晚上
      isContinuousSchedulingForMultiHours: false, //多学时（理论、实验、上机）类型的课程学时是否连续排
      canNotBeEvenlyDivided: 1, //周学时无法被连排节次整除时的安排方式
      isOverwriteScheduleEnabled: false,
    });

    const selectedClassList = ref([]);

    const taskId = ref("");

    const treeKeyword = ref("");

    const classTree = ref([]);

    const isTreeLoading = ref(false);

    const isSettingMenuLoading = ref(false);

    const scrollBarRef = ref();

    const treeRef = ref();

    const isScheduling = ref(false);

    const classListLength = computed(() => {
      return selectedClassList.value.length;
    });

    onMounted(() => {
      bus.on("showAiScheduleDialog", (busData) => {
        taskId.value = busData.taskId;
        data.isDialogVisiable = true; //List中按下按钮弹窗
        getClassTree();
      });
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

    const HandleCancelClick = () => {
      // teachingClassFormRef.value.resetFields();
      data.isDialogVisiable = false;
    };

    //check
    const HandleCheckChange = (node, isChecked) => {
      if (node.select) {
        let index = selectedClassList.value.findIndex((cl) => cl == node.id);
        if (index != -1) {
          if (!isChecked) {
            selectedClassList.value = selectedClassList.value.filter((cl) => {
              return cl !== node.id;
            });
          }
        } else {
          if (isChecked) {
            selectedClassList.value.push(node.id);
          }
        }
      }
    };

    const nodeClass = (node) => {
      return "nodeClass";
    };

    const HandleStartClick = () => {
      if (selectedClassList.value.length <= 0) {
        ElMessage.error("请至少选择一个班级!");
        return;
      }
      ElMessageBox.confirm("自动排课是否要覆盖所选班级已有的课表?", "警告", {
        confirmButtonText: "在已有的课表上继续排课",
        cancelButtonText: "覆盖课表，重新排课!",
      })
        .then(() => {
          formInput.isOverwriteScheduleEnabled = false;
        })
        .catch(() => {
          formInput.isOverwriteScheduleEnabled = true;
        })
        .then(() => {
          isScheduling.value = true; //!!!!!!!
          bus.emit("startAiSchedule")
          setAutoScheduleSettingApi(selectedClassList.value, formInput).then(
            (res) => {
              if (res) {
                if (res.meta.code) {
                  // isScheduling.value = true;
                }
              }
            }
          );
        });
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
      nodeClass,
      isSettingMenuLoading,
      HandleCheckChange,
      scrollBarRef,
      treeRef,
      selectedClassList,
      classListLength,
      isScheduling,
      HandleStartClick,

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

.scheduling {
  height: 500px;
  padding: 10px;
  border-radius: 8px;
  border: solid 1px #dcdfe6;
}

.schedulingTitle {
  font-size: 20px;
  font-weight: bold;
}

.schedulingContent {
  margin: 10px 5px;
}
.schedulingText {
  font-size: 17px;
  margin-top: 20px;
}

.chatCollapse {
  height: 450px;
}

.chartScrollBar {
  height: 375px;
  width: auto;
  padding: 10px;
  border-radius: 8px;
  border: solid 1px #dcdfe6;
}

.chatView {
  height: max-content;
  width: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.chatMessage {
  height: max-content;
  width: max-content;
  margin: 15px 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
}

.chatAvatar {
  height: 40px;
  width: 40px;
  border-radius: 20px;
}

.chatTextBorder {
  width: auto;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: left;
  padding: 10px;
  border-radius: 4px;
  border: solid 1px #dcdfe6;
}

.chatText {
  width: 100%;
  height: max-content;
  justify-self: left;
  display: flex;
  flex-direction: row;
}

.chatLoading {
  width: 12px;
  height: 12px;
  margin-left: 10px;
  border: 2px solid #c5c4c4;
  border-top-color: transparent;
  border-radius: 100%;
  align-self: center;
  animation: circle infinite 0.75s linear;
}

.chatProgress {
  width: auto;
  min-width: 250px;
  margin-top: 10px;
}

.autoScheduleInfo {
  min-width: 350px;
  min-height: 100px;
  height: max-content;
  margin: 5px 0px;
  padding: 5px;
  border-radius: 8px;
  border: solid 1px #dcdfe6;
}
@keyframes circle {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

