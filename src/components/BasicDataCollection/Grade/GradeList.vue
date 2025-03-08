<template>
  <div class="List">
    <div class="buttonMenu">
      <el-button type="primary" @click="HandleAddClick">添加</el-button>
      <el-button
        type="primary"
        @click="HandleRefreshClick"
        :loading="refreshLoading"
        >刷新</el-button
      >
      <el-button type="danger" v-show="isDeleteShow" @click="HandleArrayDelete"
        >删除选中</el-button
      >

      <el-input
        class="searchInput"
        v-model="keyWordTemp"
        :prefix-icon="Search"
        @clear="HandleClear"
        clearable
      />
      <el-button @click="HandleSearchClick">搜索</el-button>
    </div>

    <el-table
      :data="grades"
      :row-style="rowStyle"
      height="450px"
      @selection-change="HandleSelectChange"
      v-loading="isLoading"
      element-loading-text="正在加载..."
      ref="tableRef"
    >
      <el-table-column type="selection" :selectable="selectable" width="55" />
      <el-table-column prop="name" label="年级名称" />
      <el-table-column prop="duration" label="学制" />
      <el-table-column
        prop="educationalLevelId"
        :formatter="educationalLevelFormatter"
        label="学制类型"
      />
      <el-table-column prop="enrollmentYear" label="开始年份" />
      <el-table-column prop="graduationYear" label="结束年份" />
      <el-table-column
        prop="isGraduated"
        :formatter="isGraduatedFormatter"
        label="是否毕业"
      />
      <el-table-column label="操作" v-slot="scope">
        <div class="RowButtons">
          <el-button type="primary" @click="HandleEditClick(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" @click="HandleSingleDelete(scope.row)"
            >删除</el-button
          >
        </div>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="HandlePageChange"
      @size-change="HandleSizeChange"
      v-model:current-page="pageInfo.page"
      v-model:page-size="pageInfo.size"
      layout=" prev, pager, next,sizes,jumper,total"
      style="margin: 10px 20px 0px 20px"
      :total="academicStore.gradeNum"
      :size="pageInfo.size"
      :page-sizes="[5, 10, 20, 50, 100, 200, 300]"
      :default-page-size="5"
      background
    />
  </div>
  <GradeEditDialog />
</template>

<script>
import bus from "@/bus/bus.js";
import { storeToRefs } from "pinia";
import { onMounted, onBeforeMount, reactive, toRefs, ref } from "vue";
import { ElMessageBox } from "element-plus";
import { useLocationStore } from "@/store/locationStore/index.js";
import { useAcademicStore } from "@/store/academicStore/index.js";
import { ArrayDelete, SingleDelete } from "@/hooks/list/useDelete.js";
import GradeEditDialog from "./GradeEditDialog.vue";
import { Search } from "@element-plus/icons-vue";


export default {
  name: "gradesList",
  components: {
    GradeEditDialog,
  },
  setup() {
    const locationStore = useLocationStore();
    const academicStore = useAcademicStore();
    const { campuses } = storeToRefs(locationStore);
    const { grades } = storeToRefs(academicStore);
    const tableRef = ref();

    const data = reactive({
      isDeleteShow: false,
      deleteValue: [],
      isLoading: false,
      refreshLoading: false,
      keyWordTemp: "",
      keyWord: "",
      pageInfo: {
        page: 1,
        size: 5,
        total: 0,
      },
    });

    const HandleSearchClick = () => {
      if (data.keyWordTemp) {
        data.pageInfo.page = 1;
        data.isLoading = true;
        data.keyWord = data.keyWordTemp;
        academicStore
          .getGradeByQuery(data.keyWord, data.pageInfo.page, data.pageInfo.size)
          .then((res) => {
            if (res === 200) {
              data.pageInfo.page = 1;
              data.isLoading = false;
              tableRef.value.scrollTo(0, 0);
            }
            if (res === 400) {
              data.isLoading = false;
            }
          });
      } else {
        ElMessage.warning("请输入关键词!");
      }
    };

    const HandleClear = () => {
      data.keyWord = "";
      (data.pageInfo.page = 1), (data.isLoading = true);
      academicStore
        .getGrades({ page: 1, size: data.pageInfo.size })
        .then((res) => {
          if (res === 200) {
            data.pageInfo.page = 1;
            data.refreshLoading = false;
            data.isLoading = false;
            tableRef.value.scrollTo(0, 0);
          }
        });
    };

    const HandleRefreshClick = () => {
      data.pageInfo.page = 1;
      data.isLoading = true;
      data.refreshLoading = true;
      if (data.keyWord) {
        academicStore
          .getGradeByQuery(data.keyWord, data.pageInfo.page, data.pageInfo.size)
          .then((res) => {
            console.log(res);
            if (res === 200) {
              data.pageInfo.page = 1;
              data.refreshLoading = false;
              data.isLoading = false;
              tableRef.value.scrollTo(0, 0);
            }
            if (res === 400) {
              data.isLoading = false;
              data.refreshLoading = false;
            }
          });
      } else {
        academicStore
          .getGrades({ page: 1, size: data.pageInfo.size })
          .then((res) => {
            if (res === 200) {
              data.pageInfo.page = 1;
              data.refreshLoading = false;
              data.isLoading = false;
              tableRef.value.scrollTo(0, 0);
            }
          });
      }
    };

    const HandleSelectChange = (value) => {
      data.deleteValue = value;
      if (value.length === 0) {
        data.isDeleteShow = false;
      } else {
        data.isDeleteShow = true;
      }
    };

    const HandlePageChange = (page) => {
      data.isLoading = true;
      if (data.keyWord) {
        academicStore
          .getGradeByQuery(data.keyWord, page, data.pageInfo.size)
          .then((res) => {
            if (res === 200) {
              data.isLoading = false;
              tableRef.value.scrollTo(0, 0);
            }
            if (res === 400) {
              data.isLoading = false;
            }
          });
      } else {
        academicStore
          .getGrades({
            page,
            size: data.pageInfo.size,
          })
          .then((res) => {
            if (res === 200) {
              data.isLoading = false;
              tableRef.value.scrollTo(0, 0);
            }
          });
      }
    };
    const HandleSizeChange = (size) => {
      data.isLoading = true;
      if (data.keyWord) {
        academicStore
          .getGradeByQuery(data.keyWord, data.pageInfo.page, size)
          .then((res) => {
            if (res === 200) {
              data.pageInfo.page = 1;
              data.isLoading = false;
              tableRef.value.scrollTo(0, 0);
            }
            if (res === 400) {
              data.pageInfo.page = 1;
              data.isLoading = false;
            }
          });
      } else {
        academicStore
          .getGrades({
            page,
            size: data.pageInfo.size,
          })
          .then((res) => {
            if (res === 200) {
              data.isLoading = false;
              data.pageInfo.page = 1;
              tableRef.value.scrollTo(0, 0);
            }
          });
      }
    };

    const rowStyle = ({ row, rowIndex }) => {
      return {
        height: "60px",
      };
    };

    const HandleAddClick = () => {
      bus.emit("showGradeAdd");
    };

    const HandleEditClick = (value) => {
      bus.emit("showGradeEdit", value);
    };

    const HandleArrayDelete = () => {
      ElMessageBox.confirm("确认删除吗?", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          campuses.value = ArrayDelete(campuses.value, data.deleteValue);
        })
        .catch(() => {
          console.log("canceled...");
        });
    };

    const HandleSingleDelete = (value) => {
      ElMessageBox.confirm("确认删除吗?", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          campuses.value = SingleDelete(campuses.value, value);
        })
        .catch(() => {
          console("canceled...");
        });
    };

    const isGraduatedFormatter = (row) => {
      return row.isGraduated ? "是" : "否";
    };

    const educationalLevelFormatter = (row) => {
      return academicStore.educationalLevelNameMap.get(row.educationalLevelId);
    };

    return {
      ...toRefs(data),
      campuses,
      HandleArrayDelete,
      HandleSingleDelete,
      HandleSelectChange,
      HandleAddClick,
      HandleEditClick,
      rowStyle,
      locationStore,
      academicStore,
      grades,
      isGraduatedFormatter,
      educationalLevelFormatter,
      HandlePageChange,
      HandleSizeChange,
      tableRef,
      HandleRefreshClick,
      HandleSearchClick,
      HandleClear,
      Search
    };
  },
};
</script>

<style scoped>
.List {
  background: white;
  padding: 10px;
  margin: 10px;
  border: solid 2px #f0f2f5;
}

.buttonMenu {
  display: flex;
  justify-content: flex-start;
  margin: 0px 0px 10px 0px;
}

tbody td .cell .RowButtons {
  display: flex;
  flex-wrap: nowrap;
}
.el-table {
  border: solid 2px #f0f2f5;
}

.el-pagination {
}

.searchInput {
  max-width: 20%;
  margin: 0px 10px;
}
</style>