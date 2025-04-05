<template>
  <div class="setCourseHourBody">
    <div class="setCourseHourDiv">
      <div class="scrollbarDiv">
        <div class="courseTitle">
          <el-text type="info" class="courseTitleText">课程</el-text>
        </div>
        <!-- <el-autocomplete>qwq</el-autocomplete> -->

        <el-scrollbar height="290px">
          <el-menu>
            <el-menu-item
              class="menuItem"
              v-for="course of courseList"
              :key="course.id"
              :index="course.id"
              @click="HandleCourseClick(course)"
            >
              {{ course.name }}
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </div>
      <div class="courseHourTableDiv">
        <!-- <el-button class="allsetButton" type="primary" @click="HandleShowDialog"
          >统一设置</el-button
        > -->
        <span class="courseNameTitle" v-if="!currentCourse">请先选择课程</span>
        <span class="courseNameTitle" v-else>{{ currentCourse.name }}</span>
        <el-input-number
          class="allsetButton"
          placeholder="统一设置"
          controls-position="right"
          :disabled="!isTeachingClassSelected"
          v-model="batchUpdateValue"
          @change="HandleBatchSetting"
        ></el-input-number>
        <el-table
          class="courseHourTable"
          :data="currentTeachingClassList"
          @selection-change="HandleSelectionChange"
          ref="teachingClassTableRef"
        >
          <el-table-column
            type="selection"
            :selectable="selectable"
            width="50px"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="教学班名称"
            width="300px"
          ></el-table-column>
          <el-table-column prop="name" label="班级组成" width="200px">
            <template #default="scope">
              <div class="tagContainer">
                <el-tag class="classTag" v-for="cl of scope.row.classList">
                  {{ cl.name }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="150px">
            <template #default="scope">
              <div class="tagContainer">
                <el-tag
                  class="classTag"
                  type="warning"
                  v-show="scope.row.isFixedClassroom"
                >
                  固定教室
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="周学时">
            <template #default="scope">
              <el-input-number
                class="eduhourInput"
                :controls="true"
                controls-position="right"
                v-model="scope.row.coursehour"
                max="168"
                min="0"
                @change="HandleInputChange(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import {
  updateCourseHour,
  batchUpdateCourseHour,
} from "@/api/schedule/setCourseHour/courseHour.api.js";
import { getCourseListApi } from "@/api/schedule/setCourseHour/courseList.api.js";
import { getTeachingClassListApi } from "@/api/schedule/setCourseHour/teachingClassList.api.js";
import { useRoute } from "vue-router";
import { ElLoading, ElMessage } from "element-plus";
export default {
  name: "SetCourseHour",
  setup() {
    const courseTab = ref("");
    const courseList = ref([
      {
        id: "gdsfx1",
        name: "高等数学(一)",
        teachingClassList: [
          {
            id: "21rgzb",
            name: "21软件工程中本一体化",
            coursehour: 0,
            isFixedClassroom: true,
            classList: [
              {
                id: "qwq",
                name: "21物联网技术应用",
              },
              {
                id: "qwq",
                name: "21物联网技术应用",
              },
            ],
          },
          {
            id: "21rgzb",
            name: "21软件工程中本一体化",
            coursehour: 0,
            isFixedClassroom: true,
            classList: [
              {
                id: "qwq",
                name: "21物联网技术应用",
              },
              {
                id: "qwq",
                name: "21物联网技术应用",
              },
            ],
          },
          {
            id: "21rgzb",
            name: "21软件工程中本一体化",
            coursehour: 0,
            isFixedClassroom: true,
            classList: [
              {
                id: "qwq",
                name: "21物联网技术应用",
              },
              {
                id: "qwq",
                name: "21物联网技术应用",
              },
            ],
          },
          {
            id: "21rgzb",
            name: "21软件工程中本一体化",
            coursehour: 0,
            isFixedClassroom: true,
            classList: [
              {
                id: "qwq",
                name: "21物联网技术应用",
              },
              {
                id: "qwq",
                name: "21物联网技术应用",
              },
            ],
          },
          {
            id: "21rgzb",
            name: "21软件工程中本一体化",
            coursehour: 0,
            isFixedClassroom: true,
            classList: [
              {
                id: "qwq",
                name: "21物联网技术应用",
              },
              {
                id: "qwq",
                name: "21物联网技术应用",
              },
            ],
          },
        ],
      },
      {
        id: "gdsfx1",
        name: "高等数学(一)",
        teachingClassList: [
          {
            id: "21rgzb",
            name: "21软件工程中本一体化",
            coursehour: 0,
            isFixedClassroom: false,
            classList: [
              {
                id: "qwq",
                name: "21物联网技术应用",
              },
              {
                id: "qwq",
                name: "21物联网技术应用",
              },
            ],
          },
        ],
      },
      {
        id: "gdsfx1",
        name: "高等数学(一)",
        teachingClassList: [
          {
            id: "21rgzb",
            name: "21软件工程中本一体化",
            coursehour: 0,
            isFixedClassroom: false,
            classList: [
              {
                id: "qwq",
                name: "21物联网技术应用",
              },
              {
                id: "qwq",
                name: "21物联网技术应用",
              },
            ],
          },
        ],
      },
      {
        id: "gdsfx1",
        name: "高等数学(一)",
        teachingClassList: [
          {
            id: "21rgzb",
            name: "21软件工程中本一体化",
            coursehour: 0,
            isFixedClassroom: false,
            classList: [
              {
                id: "qwq",
                name: "21物联网技术应用",
              },
              {
                id: "qwq",
                name: "21物联网技术应用",
              },
            ],
          },
        ],
      },
    ]);
    const currentCourse = ref("");
    const currentTeachingClassList = ref(
      [
      {
        id: "21rgzb",
        name: "21软件工程中本一体化",
        coursehour: 0,
        isFixedClassroom: true,
        classList: [
          {
            id: "qwq",
            name: "21物联网技术应用",
          },
          {
            id: "qwq",
            name: "21物联网技术应用",
          },
        ],
      },
      {
        id: "21rgzb",
        name: "21软件工程中本一体化",
        coursehour: 0,
        isFixedClassroom: true,
        classList: [
          {
            id: "qwq",
            name: "21物联网技术应用",
          },
          {
            id: "qwq",
            name: "21物联网技术应用",
          },
        ],
      },
      {
        id: "21rgzb",
        name: "21软件工程中本一体化",
        coursehour: 0,
        isFixedClassroom: true,
        classList: [
          {
            id: "qwq",
            name: "21物联网技术应用",
          },
          {
            id: "qwq",
            name: "21物联网技术应用",
          },
        ],
      },
      {
        id: "21rgzb",
        name: "21软件工程中本一体化",
        coursehour: 0,
        isFixedClassroom: true,
        classList: [
          {
            id: "qwq",
            name: "21物联网技术应用",
          },
          {
            id: "qwq",
            name: "21物联网技术应用",
          },
        ],
      },
      {
        id: "21rgzb",
        name: "21软件工程中本一体化",
        coursehour: 0,
        isFixedClassroom: true,
        classList: [
          {
            id: "qwq",
            name: "21物联网技术应用",
          },
          {
            id: "qwq",
            name: "21物联网技术应用",
          },
        ],
      },
    ]);
    const currentSelectedTeachingClassList = ref([]);
    const batchUpdateValue = ref();
    const eduHourTemp = ref("");
    const route = useRoute();
    const isNumInputMouseUp = ref();
    const taskId = useRoute().query.id;
    const teachingClassTableRef = ref();

    onMounted(() => {
      currentSelectedTeachingClassList.value = [];
      getCourseList();
    });

    const HandleCourseClick = (course) => {
      currentSelectedTeachingClassList.value = [];
      currentCourse.value = course;
    };

    watch(currentCourse, () => {
      batchUpdateValue.value = "";
      currentSelectedTeachingClassList.value = [];
      teachingClassTableRef.value.clearSelection();
    });

    let timer;
    const debounce = function (fun, delay) {
      //防抖函数
      return function () {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          fun();
        }, delay);
      };
    };

    const HandleInputChange = (row) => {
      debounce(() => {
        setCourseHour(
          route.query.id,
          row.id,
          currentCourse.value.id,
          row.coursehour
        );
      }, 800)();
    };

    const setCourseHour = (taskId, classId, courseId, courseHour) => {
      const Loading = ElLoading.service({
        lock: true,
        text: "处理中",
        background: "rgba(0, 0, 0, 0.4)",
      });
      updateCourseHour(taskId, classId, courseId, courseHour)
        .then((res) => {
          if (res) {
            if (res.code === 200) {
              getTeachingClassList();
              Loading.close();
            }
          }
        })
        .finally(() => {
          getTeachingClassList();
          Loading.close();
        });
    };

    //获取课程列表
    const getCourseList = () => {
      getCourseListApi(taskId).then((res) => {
        if (res) {
          if (res.code === 200) {
            courseList.value = res.data;
          }
        }
      });
    };

    //获取当前课程的教学班列表
    const getTeachingClassList = () => {
      getTeachingClassListApi(taskId, currentCourse.value.id).then((res) => {
        if (res) {
          if (res.code === 200) {
            currentTeachingClassList.value = res.data;
          }
        }
      });
    };

    //批量设置周学时
    const HandleBatchSetting = () => {
      debounce(() => {
        batchUpdateCourseHour(
          taskId,
          currentCourse.value.id,
          currentSelectedTeachingClassList.value.map((tc) => tc.id),
          batchUpdateValue.value
        )
          .then((res) => {
            if (res) {
              if (res.code === 200) {
                getTeachingClassList();
                ElMessage.success("修改成功!");
              }
            }
          })
          .finally(() => {
            batchUpdateValue.value = "";
            currentSelectedTeachingClassList.value = [];
            teachingClassTableRef.value.clearSelection();
          });
      }, 100)();
    };

    const HandleSelectionChange = (selection) => {
      currentSelectedTeachingClassList.value = selection;
    };

    const isTeachingClassSelected = computed(() => {
      return currentSelectedTeachingClassList.value.length > 0;
    });

    return {
      courseTab,
      courseList,
      currentTeachingClassList,
      currentCourse,
      HandleCourseClick,
      eduHourTemp,
      HandleInputChange,
      isNumInputMouseUp,
      HandleBatchSetting,
      HandleSelectionChange,
      currentSelectedTeachingClassList,
      isTeachingClassSelected,
      getTeachingClassList,
      batchUpdateValue,
      teachingClassTableRef,
    };
  },
};
</script>

<style scoped>
.setCourseHourBody {
  height: 520px;
  display: flex;
  margin: 10px 0px 0px 0px;
  flex-direction: column;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}
.setCourseHourDiv {
  height: 100%;
  display: flex;
  flex-direction: row;
  background: white;
  overflow: hidden;
}

.courseTitle {
  height: 40px;
  display: flex;
  justify-content: center;
  background: #f2f6fc;
  border-bottom: solid 1px #ebeef5;
}

.courseTitleText{
  font-size: 16px;
  font-weight: bold;
}

.viewTabs {
  width: 100%;
  display: flex;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
}

.menuItem {
  padding: 10px;
  height: max-content;
  width: 100%;
  line-height: normal;
  white-space: unset !important;
  word-break: break-all;
  border: solid 1px #dcdfe6;
  border-width: 0px 0px 1px 0px;
}
:deep(.el-tabs--border-card .el-tabs__content) {
  padding: 0px;
}
.courseTabs {
  width: 100%;
  display: flex;
  background: white;
  margin: 0px;
}

.el-scrollbar {
  height: 100%;
}

.scrollbarDiv {
  width: 30%;
  margin: 10px 0px 10px 10px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
}

.courseHourTableDiv {
  width: 100%;
  margin: 10px 10px 10px 10px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.courseHourTable {
  height: 100%;
  margin: 10px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
}

.eduhourInput {
  width: 100px;
}

.allsetButton {
  margin: 10px 10px 0px 10px;
}

.tagContainer {
  width: min-content;
  height: max-content;
  display: flex;
  flex-direction: column;
}

.classTag {
  margin: 5px 10px;
}

.courseNameTitle {
  width: 100%;
  margin: 10px;
  font-size: 22px;
  font-weight: bold;
}
</style>