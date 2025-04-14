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
      <el-button
        type="danger"
        v-show="isDeleteShow"
        @click="HandleDelete(deleteValue.map((d) => d.id))"
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
      :data="departments"
      :row-style="rowStyle"
      height="450px"
      @selection-change="HandleSelectChange"
      v-loading="isLoading"
      element-loading-text="正在加载..."
      ref="tableRef"
    >
      <el-table-column type="selection" :selectable="selectable" width="55" />
      <el-table-column prop="departmentId" label="部门代码" />
      <el-table-column prop="departmentName" label="部门名称" />
      <el-table-column prop="type" label="单位类别" width="90" />
      <el-table-column prop="staticBuilding" label="固定教学楼" />
      <el-table-column
        prop="entity"
        label="是否为实体"
        :formatter="isEntityToYesNo"
      />
      <el-table-column
        prop="enabled"
        label="是否启用"
        :formatter="isEnabledToYesNo"
      />
      <el-table-column
        prop="offeringCourseUnit"
        label="是否开课"
        :formatter="isCourseOfferingToYesNo"
      />
      <el-table-column
        prop="teachingCourse"
        label="是否上课"
        :formatter="isTeachingToYesNo"
      />
      <el-table-column
        prop="offeringClassroom"
        label="是否开课教研室"
        :formatter="isTeachingResearchOfficeToYesNo"
      />
      <el-table-column label="操作" v-slot="scope" width="160">
        <div class="RowButtons">
          <el-button type="primary" @click="HandleEditClick(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" @click="HandleDelete([scope.row.id])"
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
      :total="academicStore.departmentNum"
      :size="pageInfo.size"
      :page-sizes="[5, 10, 20, 50, 100, 200, 300]"
      :default-page-size="5"
      background
    />
  </div>

  <DepartmentEditDialog />
</template>

<script>
import bus from "@/bus/bus.js";
import { onMounted, reactive, toRefs, ref } from "vue";
import DepartmentEditDialog from "./DepartmentEditDialog.vue";
import { useAcademicStore } from "@/store/academicStore/index.js";
import { storeToRefs } from "pinia";
import { Search } from "@element-plus/icons-vue";
import { deleteDepartmentApi } from "@/api/basicData/departments.api";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  name: "DepartmentList",
  components: {
    DepartmentEditDialog,
  },
  setup() {
    const academicStore = useAcademicStore();
    const { departments } = storeToRefs(academicStore);
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
      },
    });

    onMounted(() => {
      bus.on("updateDepartment", (isInitPage) => {
        updateDepartment(isInitPage);
      });
    });

    const updateDepartment = (isInitPage) => {
      data.isLoading = true;
      if (isInitPage) {
        data.pageInfo.page = 1;
        data.pageInfo.size = 5;
        data.keyWord = "";
        data.keyWordTemp = "";
      }
      if (data.keyWord) {
        data.isLoading = true;
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
          .getDepartments({ page, size: data.pageInfo.size })
          .then((res) => {
            if (res === 200) {
              data.isLoading = false;
              tableRef.value.scrollTo(0, 0);
            }
          });
      }
    };

    const HandlePageChange = (page) => {
      data.isLoading = true;
      if (data.keyWord) {
        data.isLoading = true;
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
          .getDepartments({ page, size: data.pageInfo.size })
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
        data.pageInfo.page = 1;
        data.isLoading = true;
        academicStore
          .getGradeByQuery(data.keyWord, data.pageInfo.page, size)
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
          .getDepartments({ page: data.pageInfo.page, size })
          .then((res) => {
            if (res === 200) {
              data.isLoading = false;
              tableRef.value.scrollTo(0, 0);
            }
          });
      }
    };

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
        .getDepartments({ page: 1, size: data.pageInfo.size })
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
          .getDepartments({ page: 1, size: data.pageInfo.size })
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

    const rowStyle = ({ row, rowIndex }) => {
      return {
        height: "60px",
      };
    };
    const HandleAddClick = () => {
      bus.emit("showDepartmentAdd");
    };

    const HandleEditClick = (value) => {
      bus.emit("showDepartmentEdit", value);
    };

    const boolToYesNo = {
      isAssignedToYesNo: (row) => {
        return row.isAssigned ? "是" : "否";
      },
      isTeachingToYesNo: (row) => {
        return row.teachingCourse ? "是" : "否";
      },
      isEnabledToYesNo: (row) => {
        return row.enabled   ? "是" : "否";
      },
      isTeachingResearchOfficeToYesNo: (row) => {
        return row.offeringClassroom ? "是" : "否";
      },
      isCourseOfferingToYesNo: (row) => {
        return row.offeringCourseUnit ? "是" : "否";
      },
      isEntityToYesNo: (row) => {
        return row.entity ? "是" : "否";
      },
    };

    const HandleDelete = (list) => {
      ElMessageBox.confirm("确认删除吗?", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteDepartmentApi(list).then((res) => {
          if (res) {
            if (res.code === 200) {
              ElMessage.success("操作成功!");
              data.pageInfo.page = 1;
              HandleRefreshClick();
            }
          }
        });
      });
    };

    return {
      ...toRefs(data),
      ...boolToYesNo,
      departments,
      HandleSelectChange,
      HandleAddClick,
      HandleEditClick,
      rowStyle,
      HandlePageChange,
      HandleSizeChange,
      HandleSearchClick,
      HandleClear,
      HandleRefreshClick,
      academicStore,
      tableRef,
      Search,
      HandleDelete,
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

.searchInput {
  max-width: 20%;
  margin: 0px 10px;
}

tbody td .cell .RowButtons {
  display: flex;
  flex-wrap: nowrap;
}

.el-table {
  border: solid 2px #f0f2f5;
}
</style>