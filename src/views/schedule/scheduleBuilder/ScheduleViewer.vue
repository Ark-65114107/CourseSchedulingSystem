<template>
  <div class="scheduleViewerBody">
    <div class="filterContianer">
      <div class="filterItem">
        <el-text class="filterTitle">院系:</el-text>
        <el-select
          class="filterSelect"
          v-model="facultyKeyword"
          remote
          filterable
          :remote-method="searchFaculty"
          :loading="isFacultyLoading"
          @change="HandleFacultyChange"
        >
          <el-scrollbar height="400px">
            <el-option
              v-for="option of faculty"
              :label="option.name"
              :value="option.id"
              :key="id"
            />
          </el-scrollbar>
        </el-select>
      </div>
      <div class="filterItem">
        <el-text class="filterTitle">专业:</el-text>
        <el-select
          class="filterSelect"
          v-model="majorKeyword"
          filterable
          remote
          :remote-method="searchMajor"
          :loading="isMajorLoading"
        >
          <el-scrollbar height="400px">
            <el-option
              v-for="option of major"
              :label="option.name"
              :value="option.id"
              :key="id"
            />
          </el-scrollbar>
        </el-select>
      </div>
      <div class="filterItem">
        <el-text class="filterTitle">年级:</el-text>
        <el-select class="filterSelect" v-model="gradeKeyword">
          <el-scrollbar height="400px">
            <el-option
              v-for="option of grade"
              :label="option.name"
              :value="option.id"
              :key="id"
            />
          </el-scrollbar>
        </el-select>
      </div>
    </div>

    <div class="mainContainer">
      <div class="classTreeDiv">
        <el-text class="classTreeTitle">班级</el-text>
        <el-input
          v-model="treeKeyword"
          placeholder="搜索班级"
          size="small"
          clearable
        ></el-input>
        <el-scrollbar
          class="classTreeScrollBar"
          height="140px"
          v-loading="isClassTreeLoading"
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
      <div class="scheduleViewerContainer">
        <el-button class="exportButton" type="primary" size="small"
          >导出</el-button
        >
        <div class="scheduleContainer">
          <FullCalendar></FullCalendar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, watch, toRefs } from "vue";
import { Search } from "@element-plus/icons-vue";
import FullCalendar from "@fullcalendar/vue3";
import { getClassListApi } from "@/api/schedule/addClass/classList.api.js";
import { useRoute } from "vue-router";
import router from "@/router";

export default {
  name: "scheduleViewer",
  setup() {
    const taskId = useRoute().query.id;

    const isClassTreeLoading = ref(false);
    const isFacultyLoading = ref(false);
    const isMajorLoading = ref(false);

    const filterKeywords = reactive({
      facultyKeyword: "",
      majorKeyword: "",
      gradeKeyword: "",
    });

    const filterOptions = reactive({
      faculty: [],
      major: [
        {
          id: "*",
          name: "全部",
        },
      ],
      grade: [
        {
          id: "*",
          name: "全部",
        },
        {
          id: "19",
          name: "2019级",
        },
        {
          id: "20",
          name: "2020级",
        },
        {
          id: "21",
          name: "2021级",
        },
        {
          id: "22",
          name: "2022级",
        },
        {
          id: "23",
          name: "2023级",
        },
        {
          id: "24",
          name: "2024级",
        },
      ],
    });

    const loadClassList = () => {
      console.log("已经到底了~");
    };

    const classTree = ref([
      {
        id: "rgzb241",
        label: "24软件工程中本一体化",
        campus: "南浔校区",
        facultyId: "jsj",
        majorId: "rgzb",
        isFixedClassRoom: false,
      },
      {
        id: "rgzb231",
        label: "23软件工程中本一体化",
      },
      {
        id: "rgzb221",
        label: "22软件工程中本一体化",
      },
      {
        id: "jsjwl",
        label: "计算机网络",
      },
      {
        id: "21wlzb",
        label: "21物联网技术应用中本一体化",
      },
    ]);

    const treeKeyword = ref("");

    //树结构过虑
    const treeFilter = (value, data) => {
      if (!value) return true;
      return data.label.includes(value);
    };

    const currentClass = ref({});

    const HandleTreeNodeClick = () => {};

    const HandleFacultyChange = () => {};

    const searchFaculty = () => {
      isFacultyLoading.value = true;
      setTimeout(() => {
        filterOptions.faculty = [
          {
            id: "*",
            name: "全部",
          },
          {
            id: "jsj",
            name: "计算机科学与技术学院",
          },
          {
            id: "jx",
            name: "机械工程学院",
          },
          {
            id: "sl",
            name: "水利工程学院",
          },
          {
            id: "jz",
            name: "建筑工程学院",
          },
        ];
        isFacultyLoading.value = false;
      }, 500);
    };

    const searchMajor = (keyword) => {
      isMajorLoading.value = true;
      setTimeout(() => {
        let major = [
          {
            id: "rgzb",
            name: "软件工程（中本）",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
        ];
        filterOptions.major = [
          {
            id: "*",
            name: "全部",
          },
          ...major,
        ];
        isMajorLoading.value = false;
      }, 500);
    };

    const searchGrade = (keyword) => {
      isMajorLoading.value = true;
      setTimeout(() => {
        let major = [
          {
            id: "rgzb",
            name: "软件工程（中本）",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
        ];
        filterOptions.major = [
          {
            id: "*",
            name: "全部",
          },
          ...major,
        ];
        isMajorLoading.value = false;
      }, 500);
    };

    //=======api=========================

    const getFaculty = () => {};

    return {
      ...toRefs(filterOptions),
      ...toRefs(filterKeywords),
      treeFilter,
      HandleTreeNodeClick,
      searchFaculty,
      searchMajor,
      searchGrade,
      classTree,
      treeKeyword,
      isClassTreeLoading,
      loadClassList,
      isFacultyLoading,
      isMajorLoading,
      HandleFacultyChange,
    };
  },
};
</script>

<style scoped>
.scheduleViewerBody {
  height: 520px;
  display: flex;
  margin: 10px 0px 0px 0px;
  flex-direction: column;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.filterContianer {
  width: auto;
  height: 40px;
  margin: 10px 10px 0px 10px;
  display: flex;
  align-content: center;
  overflow: hidden;
}

.filterItem {
  width: max-content;
  height: max-content;
  margin: 0px 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.filterTitle {
  font-size: 16px;
  white-space: nowrap;
}

.filterSelect {
  width: 250px;
  margin: auto 10px;
}

.divider {
  margin: 5px 2px;
}

.searchButton {
  width: 100px;
  margin: 10px 20px;
}

.mainContainer {
  height: 100%;
  width: auto;
  display: flex;
  margin: 10px;
  flex-direction: row;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.clssListContainer {
  width: 20%;
  display: inline-flex;
  margin: 10px;
  flex-direction: column;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.scheduleViewerContainer {
  width: 80%;
  display: inline-flex;
  margin: 10px;
  flex-direction: column;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.classTreeDiv {
  width: 20%;
  display: inline-flex;
  flex-direction: column;
  justify-content: left;
  margin: 10px 0px 10px 10px;
  padding: 10px;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.classTreeTitle {
  margin: 3px 0px;
  font-size: 16px;
  font-weight: bold;
  justify-self: left;
}

.exportButton {
  width: 80px;
  margin: 10px;
}

.scheduleContainer {
  width: auto;
  margin: 10px;
  display: inline-flex;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}
</style>