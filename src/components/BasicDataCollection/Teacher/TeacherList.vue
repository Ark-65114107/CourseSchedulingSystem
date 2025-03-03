<template>
  <div class="List">
    <div class="buttonMenu">
      <el-button type="primary" @click="HandleAddClick">添加</el-button>
      <el-button
        type="danger"
        v-show="isDeleteShow"
        @click="HandleArrayDelete(deleteValue)"
        >删除选中</el-button
      >
    </div>
    <div class="filters">
      <el-text>院系:</el-text>
      <el-select
        v-model="faculty"
        placeholder="搜索院系"
        class="facultySelect"
        value-key="id"
        filterable
      >
        <el-option label="全部" value="*" />
        <el-option
          v-for="faculty of faculties"
          :label="faculty.name"
          :value="faculty"
        />
      </el-select>
    </div>

    <el-table
      :data="teachers"
      :row-style="rowStyle"
      @selection-change="HandleSelectChange"
      max-height="400px"
      v-loading="isLoading"
      element-loading-text="正在加载..."
      ref="tableRef"
    >
      <el-table-column type="selection" :selectable="selectable" width="55" />
      <el-table-column prop="id" label="id" min-width="80px" />
      <el-table-column prop="teacherId" label="工号" min-width="80px" />
      <el-table-column prop="name" label="姓名" min-width="80px" />
      <el-table-column
        prop="gender"
        label="性别"
        :formatter="genderFormatter"
        min-width="70px"
      />
      <el-table-column prop="ename" label="英文名" min-width="100px" />
      <el-table-column
        prop="ethnicityName"
        :formatter="ethnicityFormatter"
        label="民族"
        min-width="100px"
      />
      <el-table-column prop="titleName" label="职称" min-width="100px" />
      <el-table-column
        prop="departmentName"
        :formatter="departmentFormatter"
        label="单位"
        min-width="100px"
      />
      <el-table-column
        prop="isExternal"
        :formatter="externalFormatter"
        label="是否外聘"
        min-width="100px"
      />
      <el-table-column
        prop="facultyTypeId"
        label="教职工类别"
        min-width="90px"
      />
      <el-table-column label="操作" v-slot="scope" width="160">
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
      :total="personnelStore.teacherNum"
      :size="pageInfo.size"
      :page-sizes="[5, 10, 20, 50, 100, 200, 300]"
      :default-page-size="5"
      background
    />
  </div>
  <TeacherEditDialog />
</template>

<script>
import bus from "@/bus/bus.js";
import { computed, reactive, toRefs, ref } from "vue";
import TeacherEditDialog from "./TeacherEditDialog.vue";
import { usePersonnelStore } from "@/store/personnelStore/index.js";
import { storeToRefs } from "pinia";
import { useAcademicStore } from "@/store/academicStore";

export default {
  name: "TeacherList",
  components: {
    TeacherEditDialog,
  },
  setup() {
    const personnelStore = usePersonnelStore();
    const { teachers } = storeToRefs(personnelStore);
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

    const faculty = ref("*");
    const filtedArray = computed(() => {
      if (faculty.value == "*") {
        return teachers.value;
      } else {
        return teachers.value.filter((teacher) => {
          return faculty.value == teacher.faculty;
        });
      }
    });

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
      personnelStore
        .getTeachers({ page, size: data.pageInfo.size })
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
      personnelStore
        .getTeachers({ page: data.pageInfo.page, size })
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
      bus.emit("showTeacherAdd");
    };

    const HandleEditClick = (value) => {
      bus.emit("showTeacherEdit", value);
    };

    const genderFormatter = (row) => {
      switch (row.gender) {
        case 0:
          return "女";
        case 1:
          return "男";
        default:
          return "未设置";
      }
    };

    const ethnicityFormatter = (row) => {
      return personnelStore.ethnicityNameMap.get(row.ethnicityId);
    };
    const departmentFormatter = (row) => {
      return useAcademicStore().departmentNameMap.get(row.departmentId );
    };
    const externalFormatter = (row) => {
      return row.isExternal ? "是" : "否";
    };

    return {
      ...toRefs(data),
      teachers,
      HandleSelectChange,
      HandleAddClick,
      HandleEditClick,
      rowStyle,
      filtedArray,
      genderFormatter,
      ethnicityFormatter,
      externalFormatter,
      departmentFormatter,
      HandlePageChange,
      HandleSizeChange,
      personnelStore,
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
}

tbody td .cell .RowButtons {
  display: flex;
  flex-wrap: nowrap;
}

.el-table {
  border: solid 2px #f0f2f5;
}

.facultySelect {
  width: 260px;
  margin-left: 10px;
}

.filters {
  margin: 10px 0px 20px 20px;
  display: inline-flex;
  flex-direction: row;
}
</style>