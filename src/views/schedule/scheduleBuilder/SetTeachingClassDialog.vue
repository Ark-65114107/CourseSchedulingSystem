<template>
  <el-dialog
    v-model="isDialogVisiable"
    title="编辑教学班"
    width="520px"
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
        <div class="courseWeekDiv">
          <el-form-item
            label="上课周次："
            prop="courseWeekHours"
            style="height: auto"
          >
            <div
              class="courseWeekRow"
              v-for="weeks of formInput.courseWeekHours"
            >
              <el-input-number
                class="courseWeekInput"
                v-model="weeks.courseStartWeeks"
                controls-position="right"
                :max="weeks.courseEndWeeks - 1"
                min="1"
              >
                <template #prefix>
                  <span>第</span>
                </template>

                <template #suffix>
                  <span>周</span>
                </template>
              </el-input-number>

              <el-text>到</el-text>

              <el-input-number
                class="courseWeekInput"
                v-model="weeks.courseEndWeeks"
                controls-position="right"
                max="25"
                :min="weeks.courseStartWeeks + 1"
              >
                <template #prefix>
                  <span>第</span>
                </template>
                <template #suffix>
                  <span>周</span>
                </template>
              </el-input-number>
              <el-button
                class="courseWeekDeleteButton"
                size="small"
                type="danger"
                @click="HandleCourseWeekDelete(weeks)"
                >删除</el-button
              >
            </div>
            <el-button
              type="primary"
              size="small"
              class="courseWeekInputAddButton"
              @click="HandleCourseWeekInputAdd"
              >添加</el-button
            >
          </el-form-item>
        </div>

        <el-form-item
          label="合并教学班:"
          style="max-height: 150px"
          prop="classList"
        >
          <div class="classListDiv">
            <div style="display: flex">
              <el-autocomplete
                class="searchClassinput"
                size="small"
                placeholder="搜索周学时相同且在同一校区的教学班"
                v-model="searchClassKeyword"
                :fetch-suggestions="getClassSuggestions"
                @select="HandleOptionSelect"
                @clear="HandleInputClear"
                clearable
              >
                <template #default="{ item }">
                  {{ item.value }}
                  <div class="tagContainer">
                    <el-tag
                      class="classTag"
                      size="small"
                      v-for="cl of item.data.classList"
                      >{{ cl.name }}</el-tag
                    >
                  </div>
                </template>
              </el-autocomplete>
              <el-button
                class="classAddButton"
                type="primary"
                size="small"
                style="margin-left: 5px"
                @click="HandleClassAdd"
                >合并</el-button
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
            v-model="formInput.teachingClassSize"
            controls-position="right"
            disabled
          />
        </el-form-item>

        <el-form-item label="排课学时：">
          <el-input-number
            v-model="formInput.scheduledCourseHours"
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
          <el-select
            v-model="formInput.assignedClassroomType"
            filterable
            remote
            :remote-method="classroomTypeRemoteMethod"
            placeholder="搜索教室类型"
          >
            <el-option
              v-for="opt of classroomTypeList"
              :label="opt.name"
              :value="opt.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="指定教室：">
          <el-select
            v-model="formInput.assignedClassroom"
            filterable
            remote
            :remote-method="classroomRemoteMethod"
            placeholder="搜索教室"
          >
            <el-option
              v-for="opt of classroomList"
              :label="opt.name"
              :value="opt.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="指定教学楼：">
          <el-select
            v-model="formInput.assignedBuilding"
            filterable
            remote
            :remote-method="buildingRemoteMethod"
            placeholder="搜索教学楼"
          >
            <el-option
              v-for="opt of buildingList"
              :label="opt.name"
              :value="opt.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="指定时间：">
          <el-time-picker
            is-range
            range-separator="到"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-time-picker>
        </el-form-item>

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
import {
  getSingleTeachingClassApi,
  updateTeachingClassApi,
} from "@/api/schedule/setTeachingClass/teachingClass.api";
import { getListTeachingClassbyHourAndCampusApi } from "@/api/schedule/setTeachingClass/getListTeachingClassbyHourAndCampus.api";
import { useRoute } from "vue-router";
import nonEmptyValidator from "@/hooks/validator/useNonEmpty";
import { ElMessage, ElMessageBox } from "element-plus";
import { getTeachingBuildingListApi } from "@/api/basicData/teachingbuilding.api";
import { getClassroomListApi } from "@/api/basicData/classroom.api";

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
      courseWeekHours: [],
      scheduledCourseHours: computed(() => {
        let totalHour = 0;
        formInput.value.courseWeekHours.forEach((weeks) => {
          totalHour +=
            formInput.value.perWeekCourseHour *
            (weeks.courseEndWeeks - weeks.courseStartWeeks + 1);
        });
        return totalHour;
      }),
      courseWeekNum: 1,
      // {
      //     courseStartWeeks: 1,
      //     courseEndWeeks: 18,
      // },
      classPeriods: "",
      classList: [],
      assignedClassroomType: "",
      assignedClassroom: "",
      assignedBuilding: "",
      assignedDate: "",
      priorityLevel: 1,
      teachingClassSize: computed(() => {
        let temp = 0;
        formInput.value.classList.forEach((cl) => {
          temp += cl.size;
        });
        return temp;
      }),
      deletedClasses: [],
      mergedTeachingClasses: [],
    });

    const maxClassPeriods = computed(() => {
      if (formInput.value.perWeekCourseHour <= 2) {
        return 2;
      } else {
        return formInput.value.perWeekCourseHour / 2;
      }
    });

    const buildingList = ref([]);
    const classroomTypeList = ref([]);
    const classroomList = ref([]);

    const getBuildingList = (taskId) => {
      getTeachingBuildingListApi(id).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            buildingList.value = res.data;
          }
        }
      });
    };
    const getClassroomList = (id) => {
      getClassroomListApi(id).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            classroomList.value = res.data;
          }
        }
      });
    };
    const getBuildingLists = (id) => {
      getTeachingBuildingListApi(id).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            buildingList.value = res.data;
          }
        }
      });
    };

    onMounted(() => {
      bus.on("showSetTeachingClassDialog", (row, currentCourseId) => {
        teachingClassId.value = row.id;
        getSingleTeachingClassApi(taskId, row.id).then(
          (res) => {
            if (res) {
              if (res.meta.code === 200) {
                currentCourse.value = currentCourseId;
                formInput.value.name = res.data.name;
                formInput.value.perWeekCourseHour = res.data.perWeekCourseHour;
                formInput.value.courseWeekHours = res.data.courseStartWeekHours;
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
          updateTeachingClassApi(taskId, teachingClassId.value, {
            ...formInput.value,
          }).then((res) => {
            if (res) {
              if (res.meta.code == 200) {
                console.log(res);
                ElMessage.success("操作成功!");
                buttonIsLoading.value = false;
                teachingClassFormRef.value.resetFields();
                scrollBarRef.value.scrollTo(0, 0);
                isDialogVisiable.value = false;
              }
            }
          });
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
        ElMessageBox.confirm(
          "合并教学班后，被合并的教学班已有的设置会被清空，确定要合并吗?",
          {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          formInput.value.classList = [
            ...formInput.value.classList,
            ...selectedClass.value.data.classList,
          ];
          formInput.value.mergedTeachingClasses.push(selectedClass.value.data);
          selectedClass.value = "";
          searchClassKeyword.value = "";
        });
      }
    };

    const HandleTagClose = (item) => {
      ElMessageBox.confirm(
        "删除班级会使其变成一个独立的教学班,已有的设置会被清空，确定删除吗?",
        "温馨提示",
        {
          confirmButtonText: "确认删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        formInput.value.deletedClasses.push(item);
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
      getListTeachingClassbyHourAndCampusApi(
        taskId,
        teachingClassId.value,
        query
      ).then((res) => {
        if (res.meta.code === 200) {
          callback(
            res.data.map((tc) => ({
              value: tc.name,
              id: tc.id,
              size: tc.size,
              data: tc,
            }))
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

    const courseWeeksValidator = (rule, value, callback) => {
      if (value.length == 0) {
        //如果输入为空直接返回
        ElMessage.error("请添加至少一个周次!");
        callback(new Error("请添加至少一个周次!"));
      } else {
        let temp = value[0].courseEndWeeks;
        for (let i = 1; i < value.length; i++) {
          if (value[i].courseStartWeeks <= temp) {
            ElMessage.error("后填入的周次不能小于或等于之前填入的周次!");
            callback(new Error("后填入的周次不能小于或等于之前填入的周次!"));
          }
          temp = value[i].courseEndWeeks + 1;
        }
      }
      callback();
    };

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
      courseWeekHours: [
        {
          required: true,
          trigger: "change",
          validator: courseWeeksValidator,
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

    const HandleCourseWeekInputAdd = () => {
      if (
        formInput.value.courseWeekHours.length < 13 &&
        formInput.value.courseWeekHours.length >= 0
      ) {
        formInput.value.courseWeekHours.push({
          courseStartWeeks: 3,
          courseEndWeeks: 2,
        });
      }
    };

    const HandleCourseWeekDelete = (weeks) => {
      formInput.value.courseWeekHours = formInput.value.courseWeekHours.filter(
        (week) => {
          return week != weeks;
        }
      );
    };

    const classroomRemoteMethod = (keyword) => {
      getClassroomListApi(keyword).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            classroomList.value = res.data;
          }
        }
      });
    };
    const classroomTypeRemoteMethod = (keyword) => {
      getClassroomListApi(keyword).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            classroomTypeList.value = res.data;
          }
        }
      });
    };
    const buildingRemoteMethod = (keyword) => {
      getTeachingBuildingListApi(keyword).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            buildingList.value = res.data;
          }
        }
      });
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
      isClassPeriodsDisabled,
      maxClassPeriods,
      teachingClassFormRef,
      buttonIsLoading,
      HandleTagClose,
      HandleClassAdd,
      HandleOptionSelect,
      HandleInputClear,
      scrollBarRef,
      HandleCourseWeekInputAdd,
      HandleCourseWeekDelete,
      buildingList,
      classroomTypeList,
      classroomList,
      classroomRemoteMethod,
      classroomTypeRemoteMethod,
      buildingRemoteMethod,
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
  width: min-content;
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

.courseWeekDiv {
  display: flex;
  flex-direction: column;
  height: auto;
  border-radius: 8px;
  padding-right: 10px;
  margin-bottom: 10px;
}
.courseWeekRow {
  display: flex;
  align-content: center;
  width: 100%;
  height: max-content;
}

.courseWeekInput {
  margin: 10px 5px;
  width: 120px;
  height: 30px;
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

.courseWeekInputAddButton {
  display: flex;
  justify-self: center;
  width: 100%;
}

.courseWeekDeleteButton {
  margin: auto 0px auto auto;
}

.tagContainer {
  display: flex;
  flex-direction: column;
}
</style>