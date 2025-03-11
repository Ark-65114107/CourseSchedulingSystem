<template>
  <div class="setCourseBody">
    <el-tabs v-model="activePane" type="border-card" stretch>
      <el-tab-pane label="未选课班级" name="unselectedCourse">
        <el-table> </el-table>
      </el-tab-pane>
      <el-tab-pane label="已选课班级" name="selectedCourse">
        <el-table> </el-table>
      </el-tab-pane>
    </el-tabs>
    <div class="cousreForm">
      <div class="classTitle">
        <el-text size="large" style="font-size: 22px"
          >2024级软件工程中本一体化</el-text
        >
      </div>
      <el-button
        class="addCourseButton"
        type="primary"
        @click="HandleSetCourseClick"
        >添加课程</el-button
      >

      <div class="courseListBorder">
        <div class="nodata" v-show="hasCourse">
          <el-text type="info">暂无数据,请在上方添加</el-text>
        </div>
        <div class="courseList">
          <el-scrollbar height="250px">
            <el-tag
              class="courseTag"
              v-for="course of currentClassCourseList"
              :key="id"
              @close="HandleTagClose"
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
  <setCourseDialog />
</template>

<script>
import { Search } from "@element-plus/icons-vue";
import { computed, reactive, ref } from "vue";
import bus from "@/bus/bus";
import SetCourseDialog from "./SetCourseDialog.vue";


export default {
  name: "SetCourse",
  components: { SetCourseDialog },
  setup() {
    const activePane = ref("unselectedCourse");
    const classCourseList = reactive([
      {
        id: "wqwqwq",
        name: "2024级软件工程中本一体化",
        courseList: [
          { id: "qwwqwqwqwwq", name: "高等数学(一)" },
          { id: "qwwqwqwqwgwq", name: "线性代数" },
          { id: "qwwqwqwqawwq", name: "C语言程序基础" },
          { id: "qwwqwqwqswwq", name: "Java程序基础" },
          { id: "qwwqwqwdqwwq", name: "网络拓补" },
        ],
      },
    ]);
    const currentClass = ref("");
    const currentClassCourseList = reactive([
      { id: "qwwqwqwdqwwq", name: "网络拓补" },
      { id: "qwwqwqwdqwwq", name: "网络拓补" },
      { id: "qwwqwqwdqwwq", name: "网络拓补" },
      { id: "qwwqwqwdqwwq", name: "网络拓补" },
      { id: "qwwqwqwdqwwq", name: "网络拓补" },
      { id: "qwwqwqwdqwwq", name: "网络拓补" },
      { id: "qwwqwqwdqwwq", name: "网络拓补" },
      { id: "qwwqwqwdqwwq", name: "网络拓补" },
      { id: "qwwqwqwdqwwq", name: "网络拓补" },
      { id: "qwwqwqwdqwwq", name: "网络拓补" },
    ]);
    const hasCourse = computed(() => {
      return false;
    });

    const HandleTagClose = (tag) => {
      console.log(tag);
    };

    const HandleSetCourseClick = () => {
      bus.emit("showSetCourseDialog");
    };
    return {
      Search,
      activePane,
      classCourseList,
      currentClassCourseList,
      hasCourse,
      HandleTagClose,
      HandleSetCourseClick,
    };
  },
};
</script>

<style scoped>
.setCourseBody {
  width: 100%;
  height: 360px;
  display: flex;
  margin-top: 10px;
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

.el-table {
}

.classTitle {
  margin: 10px;
  font-weight: bold;
}

.courseListBorder {
  min-height: 200px;
  margin: 10px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
  display: flex;
}

.addCourseButton {
  margin: 10px 0px 0px 10px;
}

.nodata {
  margin: auto;
  justify-self: center;
}

.courseList {
  margin: 10px;
}

.courseTag {
  margin: 5px;
}
</style>