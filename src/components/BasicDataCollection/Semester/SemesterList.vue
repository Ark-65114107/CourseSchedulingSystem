<template>
  <div class="List">
    <div class="buttonMenu">
      <el-button type="primary" @click="HandleAddClick">添加</el-button>
      <el-button type="danger" v-show="isDeleteShow" @click="HandleArrayDelete"
        >删除选中</el-button
      >
    </div>

    <el-table
      :data="semesters"
      :row-style="rowStyle"
      @selection-change="HandleSelectChange"
      max-height="450px"
      v-loading="isLoading"
      element-loading-text="正在加载..."
      ref="tableRef"
    >
      <el-table-column type="selection" :selectable="selectable" width="40" />
      <el-table-column prop="name" label="学期名称" min-width="155px" />
      <el-table-column prop="academicYear" label="学年" min-width="100px" />
      <el-table-column
        prop="semester"
        :formatter="semesterFormatter"
        label="学期"
        min-width="100px"
      />
      <el-table-column
        prop="startAndEndDates[0]"
        label="开始日期"
        min-width="155px"
      />
      <el-table-column
        prop="startAndEndDates[1]"
        label="结束日期"
        min-width="155px"
      />
      <el-table-column
        label="操作"
        v-slot="scope"
        min-width="220px"
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
      layout=" prev, pager, next,sizes,total"
      style="margin: 10px 20px 0px 20px;"
      :total="academicStore.semesterNum"
      :size="pageInfo.size"
      :page-sizes="[5, 10, 20, 50, 100, 200, 300]"
      :default-page-size="5"
      background
    />
  </div>
  <SemesterEditDialog />
</template>

<script>
import bus from "@/bus/bus.js";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, onMounted, reactive, toRefs,ref } from "vue";
import { ElMessageBox } from "element-plus";
import { ArrayDelete, SingleDelete } from "@/hooks/list/useDelete.js";
import { useAcademicStore } from "@/store/academicStore/index.js"; //store
import SemesterEditDialog from "./SemesterEditDialog.vue";
export default {
  name: "SemesterList",
  components: {
    SemesterEditDialog,
  },
  setup() {
    const academicStore = useAcademicStore();
    const { semesters } = storeToRefs(academicStore);
    const tableRef = ref();

    const data = reactive({
      isDeleteShow: false,
      deleteValue: [],
      isLoading: false,
      pageInfo: {
        page: 1,
        size: 5,
      },
    });

    const filterCriteria = reactive({
      campus: "*",
      teachingbuilding: "*",
      type: "*",
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
      academicStore
        .getSemesters({ page, size: data.pageInfo.size })
        .then((res) => {
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
        .getSemesters({ page: data.pageInfo.page, size })
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
      bus.emit("showSemesterAdd");
    };
    const HandleEditClick = (value) => {
      bus.emit("showSemesterEdit", value);
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

    const semesterFormatter = (row) => {
      return `第${row.semester}学期`;
    };

    return {
      ...toRefs(data),
      semesters,
      HandleArrayDelete,
      HandleSingleDelete,
      HandleSelectChange,
      HandleAddClick,
      HandleEditClick,
      rowStyle,
      semesterFormatter,
      HandlePageChange,
      HandleSizeChange,
      tableRef,
      academicStore,
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