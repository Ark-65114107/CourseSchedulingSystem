<template>
  <div class="setCourseBody">
    <el-tabs class="classTabs" v-model="activePane" type="border-card" stretch>
      <el-tab-pane
        :label="`未选课班级(${unassignedClassNum})`"
        name="unselectedCourse"
      >
        <el-menu>
          <div class="nodata" v-show="!assignedClassNum">
            <el-text type="info">暂无数据</el-text>
          </div>
          <el-scrollbar
            height="300px"
            class="ClassSrollBar"
            v-show="assignedClassNum"
          >
            <el-menu-item
              class="classItem"
              v-for="cl of classList"
              :key="cl.id"
              :index="cl.id"
              @click="HandleCellClick(cl)"
              v-show="!cl.courseList.length"
            >
              {{ cl.name }}
              <el-tag class="isFixedClassroomTag" v-show="cl.isFixedClassroom"
                >固定教室</el-tag
              >
            </el-menu-item>
          </el-scrollbar>
        </el-menu>
      </el-tab-pane>
      <el-tab-pane
        :label="`已选课班级(${assignedClassNum})`"
        name="selectedCourse"
      >
        <el-menu>
          <div class="nodata" v-show="!unAssignedClassNum">
            <el-text type="info">暂无数据</el-text>
          </div>
          <el-scrollbar
            height="300px"
            class="ClassSrollBar"
            v-show="unAssignedClassNum"
          >
            <el-menu-item
              class="classItem"
              v-for="cl of classList"
              :key="cl.id"
              :index="cl.id"
              @click="HandleCellClick(cl)"
              v-show="cl.courseList.length"
              >{{ cl.name }}
              <el-tag class="isFixedClassroomTag" v-show="cl.isFixedClassroom"
                >固定教室</el-tag
              >
            </el-menu-item>
          </el-scrollbar>
        </el-menu>
      </el-tab-pane>
    </el-tabs>
    <div class="nodata" v-show="!currentClass">
      <el-text size="large">请选择要添加课程的班级</el-text>
    </div>
    <div class="cousreForm" v-show="currentClass">
      <div class="classTitle">
        <el-text size="large" style="font-size: 22px">{{
          currentClass.name
        }}</el-text>
      </div>

      <div class="searchDiv">
        <el-select
          class="searchInput"
          placeholder="搜索课程"
          v-model="SelectedOption"
          :remote-method="getSuggestions"
          :loading="isSelectLoading"
          loading-text="加载中..."
          collapse-tags
          collapse-tags-tooltip
          filterable
          remote
          multiple
        >
          <el-option
            v-for="option of options"
            :label="option.courseName"
            :value="option.courseId"
            :key="option.courseId"
            v-infinite-scroll="getSuggestions"
          />
        </el-select>

        <el-button
          class="AddCourseButton"
          type="primary"
          @click="HandleAddClick"
          >添加</el-button
        >
      </div>

      <div class="courseListBorder" v-loading="isCourseListLoading">
        <div class="nodata" v-show="!hasCourse">
          <el-text type="info">还没有课程哦,请在上方添加</el-text>
        </div>
        <div class="courseList">
          <el-scrollbar height="240px">
            <el-tag
              class="courseTag"
              v-for="course of currentClassCourseList"
              :key="id"
              @close="HandleTagClose(course)"
              size="large"
              closable
            >
              {{ course.name }}
            </el-tag>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Search } from "@element-plus/icons-vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import bus from "@/bus/bus";
import { getCoursesApi } from "@/api/basicData/course.api";
import { getClassListApi } from "@/api/schedule/addClass/classList.api";
import {
  getCourseSuggestions,
  getClassCourseListApi,
  addClassCourseApi,
  deleteClassCourseApi,
} from "@/api/schedule/setCourse/courseList.api.js";
import router from "@/router";
import { useRoute } from "vue-router";
import { ElMain, ElMessage } from "element-plus";

export default {
  name: "SetCourse",
  setup() {
    const activePane = ref("unselectedCourse");
    const classList = ref([]);
    const currentClass = ref(""); //当前选中的班级
    const currentClassCourseList = ref([]); //当前选中班级的课程列表
    const SelectedOption = ref([]); //课程多选框选中的值
    const route = useRoute(); //芝士路由
    const taskId = useRoute().query.id;
    const suggestionsCounter = ref(0);
    const hasCourse = computed(() => {
      if (currentClassCourseList.value) {
        return currentClassCourseList.value.length;
      }
      return false;
    }); //判断当前班级有没有课程

    const options = ref([]);
    const isSelectLoading = ref(false);
    const isCourseListLoading = ref(false);

    const assignedClassNum = computed(() => {
      let counter = 0;
      for (let i = 0; i < classList.value.length; i++) {
        if (classList.value[i].courseList.length > 0) {
          counter++;
        }
      }
      return counter;
    });

    const unassignedClassNum = computed(() => {
      console.log(assignedClassNum);
      return classList.value.length - assignedClassNum.value;
    });

    onMounted(() => {
      getClassList().then((res) => {
        if (res === 200) {
          if (classList.length) {
            currentClass.value = classList.value[0];
          }
        }
      });
    });

    const HandleTagClose = (tag) => {
      deleteClassCourseApi(taskId, currentClass.value.id, tag.id).then(
        (res) => {
          if (res) {
            if (res.meta.code == 200) {
              getClassCourseList();
            }
          }
        }
      );
    };

    const HandleCellClick = (row) => {
      currentClass.value = row;
      SelectedOption.value = [];
    };

    //获取班级列表
    const getClassList = () => {
      if (taskId) {
        return getClassListApi(taskId).then((res) => {
          if (res.meta.code === 200) {
            classList.value = res.data;
            return 200;
          }
        });
      }
    };

    //搜索课程
    const getSuggestions = (keyword) => {
      if (keyword) {
        isSelectLoading.value = true;
        suggestionsCounter.value = 0;
        getCourseSuggestions(taskId, currentClass.value.id, keyword).then(
          (res) => {
            if (res) {
              if (res.meta.code == 200) {
                options.value = res.data;
              }
            }
          }
        );
      } else {
        getCourseSuggestions(taskId, currentClass.value.id, NULL).then(
          (res) => {
            if (res) {
              if (res.meta.code == 200) {
                options.value = res.data;
              }
            }
          }
        );
      }
    };

    //获取某个班级的课程列表
    const getClassCourseList = () => {
      isCourseListLoading.value = true;
      if (currentClass.value.id) {
        getClassCourseListApi(taskId, currentClass.value.id)
          .then((res) => {
            if (res) {
              if (res.meta.code == 200) {
                currentClassCourseList.value = res.data;
                isCourseListLoading.value = false;
                getClassList();
              }
            }
          })
          .finally(() => {
            isCourseListLoading.value = false;
          });
      }
    };

    //添加课程
    const addClassCourse = () => {
      addClassCourseApi(
        taskId,
        currentClass.value.id,
        currentClassCourseList.value
      ).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            getClassCourseList();
            SelectedOption.value = [];
          }
        }
      });
    };

    const HandleAddClick = () => {
      if (SelectedOption.value.length <= 0) {
        ElMessage.warning("请先选择课程!");
      } else {
        addClassCourse();
      }
    };

    watch(currentClass, () => {
      getClassCourseList();
    });

    return {
      Search,
      activePane,
      currentClass,
      currentClassCourseList,
      hasCourse,
      HandleTagClose,
      HandleSetCourseClick,
      options,
      SelectedOption,
      HandleCellClick,
      assignedClassNum,
      unassignedClassNum,
      HandleAddClick,
      classList,
      isSelectLoading,
      isCourseListLoading,
      getSuggestions,
    };
  },
};
</script>

<style scoped>
.setCourseBody {
  height: 500px;
  display: flex;
  margin: 10px 0px 0px 0px;
  padding: 10px;
  justify-content: space-between;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}
.cousreForm {
  width: 70%;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.el-tabs {
  width: 30%;
  margin-right: 10px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
  margin-right: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.classTitle {
  margin: 10px;
  font-weight: bold;
}

.courseListBorder {
  min-height: 200px;
  height: 395px;
  margin: 10px 10px 0px 10px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
  display: flex;
}

.addCourseButton {
  margin: 10px 0px 0px 10px;
}

.nodata {
  height: 100%;
  margin: auto;
  align-content: center;
}

.courseList {
  margin: 10px;
}

.courseTag {
  margin: 5px;
}

.searchDiv {
  display: flex;
  flex-direction: row;
}

.searchInput {
  margin: 0px 10px;
  width: 400px;
  max-height: 30px;
}

:deep(.el-tabs__content) {
  padding: 0px;
}

.classItem {
  padding: 10px;
  height: max-content;
  width: 100%;
  line-height: normal;
  white-space: unset !important;
  word-break: break-all;
  border: solid 1px #dcdfe6;
  border-width: 0px 0px 1px 0px;
}

.el-menu {
  height: 300px;
  display: flex;
}

.ClassSrollBar {
  width: 100%;
}

.isFixedClassroomTag {
  margin-left: 10px;
}
</style>