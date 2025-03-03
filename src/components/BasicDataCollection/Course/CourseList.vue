<template>
  <div class="List">
    <div class="buttonMenu">
      <el-button type="primary" @click="HandleAddClick">添加</el-button>
      <el-button type="danger" v-show="isDeleteShow" @click="HandleArrayDelete"
        >删除选中</el-button
      >
    </div>
    <div class="filters">
      <el-text class="filterLabel">校区:</el-text>
      <el-select
        v-model="filterCriteria.campus"
        placeholder="搜索校区"
        class="filterSelector"
        value-key="id"
        filterable
        @change="filterCriteria.teachingbuilding = '*'"
      >
        <template #header>
          <el-button type="primary"> 添加校区 </el-button>
        </template>
        <el-option label="全部" value="*" />
        <el-option
          v-for="campus of campuses"
          :label="campus.name"
          :value="campus.id"
        />
      </el-select>
      <el-text class="filterLabel">教学楼:</el-text>
      <el-select
        v-model="filterCriteria.teachingbuilding"
        placeholder="搜索教学楼"
        class="filterSelector"
        value-key="id"
        filterable
      >
        <template #header>
          <el-button type="primary"> 添加教学楼 </el-button>
          <el-button type="primary"> 导入 </el-button>
        </template>
        <el-option label="全部" value="*" />
        <el-option
          v-for="option of courses"
          :label="option.name"
          :value="option.id"
        />
      </el-select>
    </div>
    <el-table
      :data="courses"
      :row-style="rowStyle"
      @selection-change="HandleSelectChange"
      max-height="400px"
      v-loading="isLoading"
      element-loading-text="正在加载..."
      ref="tableRef"
    >
      <el-table-column type="selection" :selectable="selectable" width="40" />
      <el-table-column prop="code" label="课程编号" min-width="100px" />
      <el-table-column prop="name" label="课程名称" min-width="155px" />
      <el-table-column
        prop="courseCategoryId"
        label="课程类别"
        min-width="155px"
        :formatter="courseCategoryFormatter"
      />
      <el-table-column
        prop="courseAttributeId"
        label="课程属性"
        min-width="100px"
        :formatter="courseAttributeFormatter"
      />
      <el-table-column
        prop="courseTypeId"
        label="课程类型"
        min-width="100px"
        :formatter="courseTypeFormatter"
      />
      <el-table-column
        prop="courseNatureId"
        label="课程性质"
        min-width="100px"
        :formatter="courseNatureFormatter"
      />
      <el-table-column
        prop="facultyId"
        label="开课院系"
        :formatter="departmentFormatter"
      />
      <el-table-column
        prop="isEnabled"
        :formatter="isEnableFormatter"
        label="是否启用"
      />

      <el-table-column
        label="操作"
        v-slot="scope"
        min-width="220px"
        fixed="right"
      >
        <div class="RowButtons">
          <el-button type="info" @click="HandleShowInfoClick(scope.row)"
            >查看</el-button
          >
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
      :total="academicStore.courseNum"
      :size="pageInfo.size"
      :page-sizes="[5, 10, 20, 50, 100, 200, 300]"
      :default-page-size="5"
      background
    />
  </div>
  <CourseEditDialog />
  <CourseInfoDrawer />
</template>

<script>
import bus from "@/bus/bus.js";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, onMounted, reactive, toRefs,ref } from "vue";
import { ElMessageBox } from "element-plus";
import { ArrayDelete, SingleDelete } from "@/hooks/list/useDelete.js";
import { useLocationStore } from "@/store/locationStore/index.js";
import { useAcademicStore } from "@/store/academicStore/index.js"; //store
import CourseInfoDrawer from "./CourseInfoDrawer.vue";
import CourseEditDialog from "./CourseEditDialog.vue";

export default {
  name: "CourseList",
  components: {
    CourseInfoDrawer,
    CourseEditDialog,
  },
  setup() {
    const locationStore = useLocationStore();
    const academicStore = useAcademicStore();
    const { courses } = storeToRefs(academicStore);
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
        .getCourses({ page, size: data.pageInfo.size })
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
        .getCourses({ page: data.pageInfo.page, size })
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
      bus.emit("showCourseAdd");
    };
    const HandleEditClick = (value) => {
      bus.emit("showCourseEdit", value);
    };
    const HandleShowInfoClick = (value) => {
      bus.emit("showCourseInfoDrawer", value);
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

    const isEnableFormatter = (row) => {
      return row.isAvailable ? "是" : "否";
    };

    const departmentFormatter = (row) => {
      return academicStore.departmentNameMap.get(row.departmentId);
    };
    const courseCategoryFormatter = (row) => {
      return academicStore.courseCategoryNameMap.get(row.courseCategoryId);
    };
    const courseAttributeFormatter = (row) => {
      return academicStore.courseAttributeNameMap.get(row.courseAttributeId);
    };
    const courseTypeFormatter = (row) => {
      return academicStore.courseTypeNameMap.get(row.courseTypeId);
    };
    const courseNatureFormatter = (row) => {
      return academicStore.courseNatureNameMap.get(row.courseNatureId);
    };

    return {
      ...toRefs(data),
      courses,
      HandleArrayDelete,
      HandleSingleDelete,
      HandleSelectChange,
      HandleAddClick,
      HandleEditClick,
      HandleShowInfoClick,
      rowStyle,
      filterCriteria,
      isEnableFormatter,
      departmentFormatter,
      courseCategoryFormatter,
      courseAttributeFormatter,
      courseTypeFormatter,
      courseNatureFormatter,
      HandlePageChange,
      HandleSizeChange,
      academicStore,
      tableRef,
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