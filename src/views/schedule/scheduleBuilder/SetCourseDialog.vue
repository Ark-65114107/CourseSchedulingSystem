<template>
  <el-dialog v-model="isDialogShow" :title="dialogTitle" width="50%">
    <div class="DialogBody">
      <div class="searchDiv">
        <el-autocomplete
          class="searchInput"
          placeholder="搜索课程"
          v-model="searchKeyword"
          :prefix-icon="Search"
          :fetch-suggestions="getSuggestions"
          :debounce="400"
        >
        </el-autocomplete>

        <el-button class="searchButton" type="primary">添加</el-button>
      </div>
      <el-scrollbar height="300px" style="margin-top: 10px;" class="courseScroolBar">
        <div class="courseList">
          <div class="nodata" v-show="isCourseSelected">
            <el-text type="info">暂无数据</el-text>
          </div>
          <el-tag class="courseTag" v-for="course of selectedCourses" size="large" closable>{{
            course.name
          }}</el-tag>
        </div>
      </el-scrollbar>
    </div>
  </el-dialog>
</template>

<script>
import { computed, onMounted, reactive, ref } from "vue";
import bus from "@/bus/bus";
import { Search } from "@element-plus/icons-vue";
export default {
  name: "SetCourseDialog",
  setup() {
    const isDialogShow = ref(false);
    const currentClass = ref("");
    const selectedCourses = reactive([]);
    const dialogTitle = `添加${currentClass.value}的课程`;
    const dialogSelected = reactive([]);
    const searchKeyword = ref("");
    const isCourseSelected = computed(() => {
      return selectedCourses.length <= 0;
    });
    onMounted(() => {
      bus.on("showSetCourseDialog", (value) => {
        isDialogShow.value = true;
      });
    });

    const getSuggestions = (keyword, callback) => {
      console.log(keyword);
    };
    return {
      Search,
      isDialogShow,
      dialogTitle,
      selectedCourses,
      dialogSelected,
      searchKeyword,
      getSuggestions,
      isCourseSelected,
    };
  },
};
</script>

<style scoped>
.DialogBody {
  min-height: 350px;
  height: max-content;
  margin: 10px;
  padding: 10px 10px 0px 10px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.courseList {
  min-height: 300px;
  display: flex;  
  padding: 10px 0px 10px 10px;
}

.courseScroolBar {
  min-height: 300px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.searchDiv {
  display: flex;
  flex-direction: row;
}

.searchButton {
  margin-left: 10px;
}

.nodata {
  margin: auto;
  justify-self: center;
}

.courseTag{
  margin: 0px 10px 10px 0px ;
}
</style>