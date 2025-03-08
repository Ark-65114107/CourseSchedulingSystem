<template>
  <div class="List">
    <div class="buttonMenu">
      <el-button type="primary" @click="HandleAddClick">添加</el-button>
      <el-button type="danger" v-show="isDeleteShow" @click="HandleArrayDelete"
        >删除选中</el-button
      >
    </div>
    <div class="filters">
      <el-text class="filterLabel">院系:</el-text>
      <el-select
        v-model="filterCriteria.faculty"
        placeholder="搜索院系"
        class="filterSelector"
        value-key="id"
        filterable
      >
        <el-option label="全部" value="*" />
        <el-option
          v-for="campus of faculties"
          :label="campus.name"
          :value="campus.id"
        />
      </el-select>

      <el-text class="filterLabel">培养层次</el-text>
      <el-select
        v-model="filterCriteria.educationalLevel"
        placeholder="搜索培养层次"
        class="filterSelector"
        filterable
      >
        <el-option label="全部" value="*" />
        <el-option v-for="e of educationalLevels" :label="e" :value="e" />
      </el-select>
    </div>
    <el-table
      :data="filtedArray.filtedMajors"
      :row-style="rowStyle"
      @selection-change="HandleSelectChange"
      max-height="400"
      v-loading="isLoading"
      element-loading-text="正在加载..."
      ref="tableRef"
    >
      <el-table-column type="selection" :selectable="selectable" width="40" />
      <el-table-column prop="id" label="专业编号" min-width="100px" />
      <el-table-column prop="name" label="专业名称" min-width="100px" />
      <el-table-column prop="abbr" label="简称" min-width="100px" />
      <el-table-column prop="ename" label="英文名" min-width="100px" />
      <el-table-column prop="duration" label="学制" min-width="100px" />
      <el-table-column
        prop="isEnabled"
        :formatter="enabledFormatter"
        label="开办状态"
        min-width="100px"
      />
      <el-table-column
        prop="facultyId"
        :formatter="facultyFormatter"
        label="所属院系"
        min-width="100px"
      />
      <el-table-column
        prop="educationalLevel"
        label="培养层次"
        min-width="80px"
      />

      <el-table-column
        label="专业方向"
        min-width="120px"
        fixed="right"
        v-slot="scope"
      >
        <el-link type="primary" @click="HandleDrawerClick(scope.row)"
          >专业方向管理</el-link
        >
      </el-table-column>

      <el-table-column
        label="操作"
        v-slot="scope"
        min-width="155px"
        fixed="right"
      >
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
      :total="academicStore.majorNum"
      :size="pageInfo.size"
      :page-sizes="[5, 10, 20, 50, 100, 200, 300]"
      :default-page-size="5"
      background
    />
  </div>
  <MajorEditDialog />
  <specializationListDrawer />
</template>

<script>
import bus from "@/bus/bus.js";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, onMounted, reactive, ref, toRefs } from "vue";
import { ElMessageBox } from "element-plus";
import MajorEditDialog from "./MajorEditDialog.vue";
import specializationListDrawer from "./specializationListDrawer.vue";
import { ArrayDelete, SingleDelete } from "@/hooks/list/useDelete.js";
import { useLocationStore } from "@/store/locationStore/index.js";
import { useAcademicStore } from "@/store/academicStore/index.js"; //store

export default {
  name: "MajorList",
  components: {
    MajorEditDialog,
    specializationListDrawer,
  },
  setup() {
    const locationStore = useLocationStore();
    const academicStore = useAcademicStore();
    const { majors, faculties, educationalLevels } = storeToRefs(academicStore);
    const tableRef = ref()

    const data = reactive({
      isDeleteShow: false,
      isLoading: false,
      deleteValue: [],
      pageInfo: {
        page: 1,
        size: 5,
      },
    });

    const filterCriteria = reactive({
      faculty: "*",
      educationalLevel: "*",
    });

    const filtedArray = reactive({
      filtedMajors: computed(() => {
        return majors.value
          .filter((major) => {
            if (filterCriteria.faculty == "*") {
              return true;
            } else {
              return major.facultyId == filterCriteria.faculty;
            }
          })
          .filter((major) => {
            if (filterCriteria.educationalLevel == "*") {
              return true;
            } else {
              return major.educationalLevel == filterCriteria.educationalLevel;
            }
          });
      }),
    });

    // .value.map((c) => ({
    //     ...c,
    //     campus: locationStore.campusMap.get(c.campusId),
    //     type: locationStore.classroomTypeMap.get(c.typeId),
    //     teachingbuilding:locationStore.teachingbuildingMap.get(c.teachingbuildingId)
    //   })),

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
      academicStore.getMajors({ page, size: data.pageInfo.size }).then((res) => {
          if (res === 200) {
            data.isLoading = false;
            tableRef.value.scrollTo(0, 0);
          }
        });
    };
    const HandleSizeChange = (size) => {
      data.isLoading = true;
      data.pageInfo.page = 1;
      academicStore
        .getMajors({ page: data.pageInfo.page, size })
        .then((res) => {
          if (res === 200) {
            data.isLoading = false;
            tableRef.value.scrollTo(0, 0);
          }
        });
    };

    const rowStyle = ({ row, rowIndex }) => {
      return {
        height: "60px",
      };
    };

    const HandleAddClick = () => {
      bus.emit("showMajorAdd");
    };

    const HandleEditClick = (value) => {
      bus.emit("showMajorEdit", value);
    };
    const HandleTypeEditClick = () => {
      bus.emit("showClassroomTypeDrawer");
    };

    const HandleArrayDelete = () => {
      ElMessageBox.confirm("确认删除吗?", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          classrooms.value = ArrayDelete(classrooms.value, data.deleteValue);
        })
        .catch(() => {
          console("canceled...");
        });
    };

    const HandleSingleDelete = (value) => {
      ElMessageBox.confirm("确认删除吗?", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          classrooms.value = SingleDelete(classrooms.value, value);
        })
        .catch(() => {
          console.log("canceled...");
        });
    };

    const HandleDrawerClick = (row) => {
      bus.emit("showSpecializationListDrawer", row);
    };

    const enabledFormatter = (row) => {
      return row.isEnabled ? "是" : "否";
    };
    const facultyFormatter = (row) => {
      return academicStore.departmentNameMap.get(row.facultyId);
    };

    return {
      ...toRefs(data),
      majors,
      faculties,
      HandleArrayDelete,
      HandleSingleDelete,
      HandleSelectChange,
      HandleAddClick,
      HandleEditClick,
      HandleTypeEditClick,
      HandleDrawerClick,
      rowStyle,
      filterCriteria,
      filtedArray,
      enabledFormatter,
      facultyFormatter,
      educationalLevels,
      HandlePageChange,
      HandleSizeChange,
      academicStore,
      tableRef
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
  flex-wrap: nowrap;
}

tbody td .cell .RowButtons {
  display: flex;
  flex-wrap: nowrap;
}

.el-table {
  border: solid 2px #f0f2f5;
}

.el-table-column {
  min-width: 200px;
}
.filterSelector {
  width: 260px;
  margin-left: 10px;
}

.filters {
  display: inline-flex;
  flex-direction: row;
  margin: 10px 0px 10px 0px;
}

.filterLabel {
  margin-left: 20px;
}
</style>