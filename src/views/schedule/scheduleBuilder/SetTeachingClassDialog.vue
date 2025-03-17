<template>
  <el-dialog
    v-model="isDialogVisiable"
    title="编辑教学班"
    width="500px"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <el-scrollbar height="400px" always ref="scrollBarRef">
      <el-form
        label-position="right"
        label-width="auto"
        style="margin: 20px"
        :model="formInput"
        :rules="inputRules"
        ref="teachingClassFormRef"
      >
        <el-form-item label="教学班名称:" prop="name">
          <el-input v-model="formInput.name"> </el-input>
        </el-form-item>
        <el-form-item label="周学时:" prop="perWeekCourseHour">
          <el-input-number
            v-model="formInput.perWeekCourseHour"
            controls-position="right"
            size="small"
            disabled
          ></el-input-number>
        </el-form-item>

        <el-form-item
          label="教学班组成:"
          style="max-height: 150px"
          prop="classList"
        >
          <div class="classListDiv">
            <div style="display: flex">
              <el-autocomplete
                class="searchClassinput"
                size="small"
                placeholder="搜索周学时相同的班级"
                v-model="searchClassKeyword"
                :fetch-suggestions="getClassSuggestions"
                @select="HandleOptionSelect"
                @clear="HandleInputClear"
                clearable
              ></el-autocomplete>
              <el-button
                class="classAddButton"
                type="primary"
                size="small"
                style="margin-left: 5px"
                @click="HandleClassAdd"
                >添加</el-button
              >
            </div>
            <el-scrollbar class="classListScrollbar" height="100px">
              <div class="nodata">
                <el-text type="info" v-show="!formInput.classList.length"
                  >暂无数据</el-text
                >
              </div>
              <el-tag
                class="classTag"
                v-for="cl of formInput.classList"
                :key="cl.id"
                @close="HandleTagClose(cl)"
                closable
              >
                {{ cl.name }}
              </el-tag>
            </el-scrollbar>
          </div>
        </el-form-item>

        <el-form-item label="教学班人数：">
          <el-input-number
            max="9999"
            min="0"
            v-model="teachingClassSize"
            controls-position="right"
            disabled
          />
        </el-form-item>

        <div class="courseWeek">
          <el-form-item label="上课周次：" prop="courseStartWeeks">
            <el-input-number
              class="courseWeekInput"
              v-model="formInput.courseStartWeeks"
              controls-position="right"
              :max="formInput.courseEndWeeks - 1"
              min="1"
            >
              <template #prefix>
                <span>第</span>
              </template>

              <template #suffix>
                <span>周</span>
              </template>
            </el-input-number>
          </el-form-item>

          <el-text>到</el-text>

          <el-form-item prop="courseEndWeeks">
            <el-input-number
              class="courseWeekInput"
              v-model="formInput.courseEndWeeks"
              controls-position="right"
              max="25"
              :min="formInput.courseStartWeeks + 1"
            >
              <template #prefix>
                <span>第</span>
              </template>
              <template #suffix>
                <span>周</span>
              </template>
            </el-input-number>
          </el-form-item>
        </div>

        <el-form-item label="排课学时：">
          <el-input-number
            v-model="scheduledCourseHours"
            controls-position="right"
            disabled
          />
        </el-form-item>
        <el-form-item label="连排节次：" prop="classPeriods">
          <el-input-number
            v-model="formInput.classPeriods"
            controls-position="right"
            :max="maxClassPeriods"
            :min="1"
            :disabled="isClassPeriodsDisabled"
          />
        </el-form-item>
        <el-form-item label="教室类型：">
          <el-select>
            <el-option />
          </el-select>
        </el-form-item>
        <el-form-item label="指定教室：">
          <el-select>
            <el-option />
          </el-select>
        </el-form-item>
        <el-form-item label="指定教学楼：">
          <el-select>
            <el-option />
          </el-select>
        </el-form-item>
        <el-form-item label="指定时间："> </el-form-item>

        <el-form-item label="排课优先级：" prop="priorityLevel">
          <el-input-number
            v-model="formInput.priorityLevel"
            controls-position="right"
            min="1"
            max="20"
          />
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <el-button @click="HandleCancel">取消</el-button>
      <el-button
        type="primary"
        @click="HandleClose(teachingClassFormRef)"
        :loading="buttonIsLoading"
        >确定</el-button
      >
    </template>
  </el-dialog>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import bus from "@/bus/bus";
import { getSingleTeachingClassApi } from "@/api/schedule/teachingClass.api";
import { getListClassByCourseHour } from "@/api/schedule/getListClassByCourseHour.api";
import { useRoute } from "vue-router";
import nonEmptyValidator from "@/hooks/validator/useNonEmpty";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  name: "SetTeachingClassDialog",
  setup() {
    const isDialogVisiable = ref(false);
    const currentCourse = ref("");
    const courseHour = ref(0);
    const teachingClassId = ref("");
    const taskId = useRoute().query.id;
    const searchClassKeyword = ref("");
    const selectedClass = ref("");
    const teachingClassFormRef = ref();
    const scrollBarRef = ref();
    const buttonIsLoading = ref(false);
    const formInput = ref({
      name: "",
      perWeekCourseHour: "",
      courseStartWeeks: 0,
      courseEndWeeks: 2,
      classPeriods: "",
      classList: [],
      assignedClassroomType: "",
      assignedClassroom: "",
      assignedBuilding: "",
      assignedDate: "",
      priorityLevel: 1,
    });
    const scheduledCourseHours = computed(() => {
      return (
        formInput.value.perWeekCourseHour *
        (formInput.value.courseEndWeeks - formInput.value.courseStartWeeks + 1)
      );
    });

    const maxClassPeriods = computed(() => {
      if (formInput.value.perWeekCourseHour <= 2) {
        return 2;
      } else {
        return formInput.value.perWeekCourseHour / 2;
      }
    });

    const teachingClassSize = computed(() => {
      let temp = 0;
      formInput.value.classList.forEach((cl) => {
        temp += cl.size;
      });
      return temp;
    });

    onMounted(() => {
      bus.on("showSetTeachingClassDialog", (row, currentCourseId) => {
        getSingleTeachingClassApi(taskId, row.id).then(
          (res) => {
            if (res) {
              if (res.meta.code === 200) {
                currentCourse.value = currentCourseId;
                formInput.value.name = res.data.name;
                formInput.value.perWeekCourseHour = res.data.perWeekCourseHour;
                formInput.value.courseStartWeeks = res.data.courseStartWeeks;
                formInput.value.courseEndWeeks = res.data.courseEndWeeks;
                formInput.value.classList = res.data.classList;
                formInput.value.assignedClassroom = res.data.assignedClassroom;
                formInput.value.assignedBuilding = res.data.assignedBuilding;
                formInput.value.assignedDate = res.data.assignedDate;
              }
            }
          },
          (error) => {
            console.log(error);
          }
        );
        isDialogVisiable.value = true;
      });
    });

    const HandleClose = (ref) => {
      if (!ref) return;
      ref.validate((validate) => {
        if (validate) {
          buttonIsLoading.value = true;
          //更新教学班数据
          setTimeout(() => {
            buttonIsLoading.value = false;
            teachingClassFormRef.value.resetFields();
            scrollBarRef.value.scrollTo(0, 0);
            isDialogVisiable.value = false;
            ElMessage.success("操作成功!");
          }, 1000);
        }
      });
    };

    const HandleCancel = () => {
      buttonIsLoading.value = false;
      teachingClassFormRef.value.resetFields();
      scrollBarRef.value.scrollTo(0, 0);
      isDialogVisiable.value = false;
    };

    const HandleClassAdd = () => {
      if (selectedClass.value) {
        formInput.value.classList.push({
          name: selectedClass.value.value,
          id: selectedClass.value.id,
          size: selectedClass.value.size,
        });
        selectedClass.value = "";
        searchClassKeyword.value = "";
      }
    };

    const HandleTagClose = (item) => {
      ElMessageBox.confirm(
        "删除班级会使其变回一个单独的教学班,设置会被清空，确定删除吗?",
        "温馨提示",
        {
          confirmButtonText: "确认删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        formInput.value.classList = formInput.value.classList.filter((tag) => {
          return tag != item;
        });
      });
    };

    const HandleInputClear = () => {
      selectedClass.value = "";
    };

    const HandleOptionSelect = (option) => {
      selectedClass.value = option;
    };

    const getClassSuggestions = (query, callback) => {
      getListClassByCourseHour(
        taskId,
        currentCourse.value,
        formInput.value.perWeekCourseHour,
        query
      ).then((res) => {
        if (res.meta.code === 200) {
          callback(
            res.data.map((c) => ({ value: c.name, id: c.id, size: c.size }))
          );
        }
      });
    };

    const isClassPeriodsDisabled = computed(() => {
      if (formInput.value.perWeekCourseHour <= 1) {
        formInput.value.classPeriods = 1;
        return true;
      } else {
        return false;
      }
    });

    const inputRules = {
      name: [
        {
          required: true,
          validator: nonEmptyValidator,
          trigger: "blur",
          message: "请输入教学班名称!",
        },
      ],
      perWeekCourseHour: [
        {
          required: false,
        },
      ],
      courseStartWeeks: [
        {
          required: true,
          trigger: "change",
          message: "请输入开始周次!",
        },
      ],
      courseEndWeeks: [
        {
          required: true,
          trigger: "change",
          message: "请输入结束周次!",
        },
      ],
      classList: [
        {
          required: true,
          trigger: "change",
          message: "请选择至少一个班级!",
        },
      ],
      assignedClassroomType: [
        {
          required: true,
          validator: nonEmptyValidator,
          trigger: "change",
          message: "请选择教室类型!",
        },
      ],
      assignedClassroom: [
        {
          required: false,
        },
      ],
      assignedBuilding: [
        {
          required: false,
        },
      ],
      assignedDate: [
        {
          required: false,
        },
      ],
      priorityLevel: [
        {
          required: true,
          trigger: "change",
          message: "请输入排课优先级!",
        },
      ],
    };

    return {
      formInput,
      isDialogVisiable,
      courseHour,
      HandleClose,
      HandleCancel,
      getClassSuggestions,
      searchClassKeyword,
      inputRules,
      scheduledCourseHours,
      isClassPeriodsDisabled,
      maxClassPeriods,
      teachingClassFormRef,
      buttonIsLoading,
      HandleTagClose,
      HandleClassAdd,
      HandleOptionSelect,
      HandleInputClear,
      scrollBarRef,
      teachingClassSize,
    };
  },
};
</script>

<style scoped>
.dialogBody {
  display: flex;
  justify-content: center;
}

.classListScrollbar {
  margin-top: 5px;
}

.classTag {
  margin: 5px;
}

.addClassTag {
  width: 50px;
  margin: 5px;
  border: dashed 1px #dcdfe6;
}
.addClassTag:hover {
  border: dashed 2px rgb(121.3, 187.1, 255);
  color: rgb(121.3, 187.1, 255);
}

.courseWeek {
  display: flex;
  justify-content: space-between;
  height: 60px;
}

.courseWeekInput {
  margin: 10px;
  width: 120px;
}

.el-input,
.el-select {
  max-width: 300px;
}

.classAddButton {
  margin: 5px 0px 0px 0px;
}

.searchClassinput {
  margin: 0px;
}

.classListDiv {
  width: 300px;
  max-height: 150px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
  padding: 5px;
  margin-bottom: 10px;
}

.nodata {
  height: 100%;
  width: 100%;
  margin: auto;
  display: flex;
  justify-content: center;
}
</style>