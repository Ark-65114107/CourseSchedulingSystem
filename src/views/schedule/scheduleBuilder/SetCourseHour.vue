<template>
  <div class="setCourseHourBody">
    <div class="setCourseHourDiv">
      <div class="scrollbarDiv">
        <div class="courseTitle">
        <el-text type="info">课程</el-text>

        </div>
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
        <el-button class="allsetButton" type="primary" @click="HandleShowDialog">统一设置</el-button>
        <el-table class="courseHourTable" :data="currentTeachingClassList">
          <el-table-column prop="name" label="班级名"></el-table-column>
          <el-table-column label="周学时">
            <template #default="scope">
              <el-input-number
                class="eduhourInput"
                :controls="true"
                controls-position="right"
                size="small"
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
  <SetCourseHourDialog/>
</template>

<script>
import { computed, ref } from "vue";
import { updateCourseHour } from "@/api/schedule/setCourseHour/courseHour.api.js";
import { useRoute } from "vue-router";
import { ElLoading } from "element-plus";
import bus from '@/bus/bus';
import SetCourseHourDialog from './SetCourseHourDialog.vue';
export default {
  name: "SetCourseHour",
  components:{
    SetCourseHourDialog
  },
  setup() {
    const courseTab = ref("");
    const courseList = ref([
      {
        id: "gdsfx1",
        name: "高等数学(一)",
        classList: [
          {
            id: "21rgzb",
            name: "21软件工程中本一体化",
            coursehour: 0,
          },
          {
            id: "21rgzb",
            name: "21软件工程中本一体化",
            coursehour: 0,
          },
          {
            id: "21rgzb",
            name: "21软件工程中本一体化",
            coursehour: 0,
          },
          {
            id: "wqwqdsadwq",
            name: "21软件工程1aaaaaaaaaaaaaaaaaaaaaaaaaaa",
            coursehour: 0,
          },
          {
            id: "wqwqswq",
            name: "22软件工程中本一体化1",
            coursehour: 2,
          },
          {
            id: "21jw1",
            name: "21计算机网络技术1",
            coursehour: 0,
          },
        ],
      },
      {
        id: "gdsfx2",
        name: "高等数学(二)",
        classList: [
          {
            id: "21rgzb",
            name: "21软件工程中本一体化",
            coursehour: 0,
          },
          {
            id: "wqwqdsadwq",
            name: "21软件工程1aaaaaaaaaaaaaaaaaaaaaaaaaaa",
            coursehour: 0,
          },
          {
            id: "wqwqswq",
            name: "22软件工程中本一体化1",
            coursehour: 0,
          },
          {
            id: "21jw1",
            name: "21计算机网络技术1",
            coursehour: 0,
          },
          {
            id: "21jw2",
            name: "21计算机网络技术2",
          },
        ],
      },
      {
        id: "c1sfsf",
        name: "C语言程序基础A",
        classList: [
          {
            id: "21rgzb",
            name: "21软件工程中本一体化",
          },
          {
            id: "wqwqdsadwq",
            name: "21软件工程1aaaaaaaaaaaaaaaaaaaaaaaaaaa",
          },
          {
            id: "wqwqswq",
            name: "22软件工程中本一体化1",
          },
        ],
      },
      {
        id: "xxsfsdds",
        name: "线性代数",
        classList: [
          {
            id: "21rgzb",
            name: "21软件工程中本一体化11111111111111111111111111111111",
          },
          {
            id: "wqwqdsadwq",
            name: "21软件工程1aaaaaaaaaaaaaaaaaaaaaaaaaaa",
          },
          {
            id: "wqwqswq",
            name: "22软件工程中本一体化1",
          },
          {
            id: "21jw1",
            name: "21计算机网络技术1",
          },
          {
            id: "21jw2",
            name: "21计算机网络技术2",
          },
          {
            id: "22jw1",
            name: "22计算机网络技术1",
          },
          {
            id: "21wlwzb",
            name: "21物联网技术应用中本一体化",
          },
        ],
      },
    ]);
    const currentCourse = ref("");
    const currentTeachingClassList = ref([]);
    const eduHourTemp = ref("");
    const route = useRoute();
    const isNumInputMouseUp = ref();

    const HandleCourseClick = (course) => {
      if (course != currentCourse.value) {
        currentCourse.value = course;
        currentTeachingClassList.value = course.classList;
      }
    };

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
      updateCourseHour(taskId, classId, courseId, courseHour).then((res) => {
        setTimeout(() => {
          Loading.close();
        },200);
      });
    };


    const HandleShowDialog = ()=>{
      bus.emit("showSetCourseHourDialog");
    }

    return {
      courseTab,
      courseList,
      currentTeachingClassList,
      currentCourse,
      HandleCourseClick,
      eduHourTemp,
      HandleInputChange,
      isNumInputMouseUp,
      HandleShowDialog
    };
  },
};
</script>

<style scoped>
.setCourseHourBody {
  height: 360px;
  display: flex;
  margin: 10px 0px 0px 0px;
  flex-direction: column;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}
.setCourseHourDiv {
  height: 350px;
  display: flex;
  flex-direction: row;
  background: white;
  overflow: hidden;
}

.courseTitle{
  height: 40px;
  display: flex;
  justify-content: center;
  background: #F2F6FC;
  border-bottom: solid 1px #EBEEF5; 
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
</style>