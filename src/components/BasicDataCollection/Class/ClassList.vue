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
      <el-text class="filterLabel">院系:</el-text>
      <el-select
        v-model="faculty"
        placeholder="选择院系"
        class="filterSelector"
        value-key="id"
        @visible-change="HandleFaculty"
      >
        <div
          v-infinite-scroll="getFaculty"
          :infinite-scroll-delay="1000"
          :infinite-scroll-immediate="false"
          style="overflow: hide"
        >
          <el-option label="全部" value="*" />
          <el-option
            v-for="faculty of faculties"
            :label="faculty.name"
            :value="faculty"
          />
        </div>
      </el-select>
      <el-text class="filterLabel">专业:</el-text>
      <el-select
        v-model="major"
        placeholder="搜索专业"
        class="filterSelector"
        value-key="id"
        filterable
      >
        <el-option label="全部" value="*" />
        <el-option v-for="major of majors" :label="major.name" :value="major" />
      </el-select>
    </div>

    <el-table
      :data="classes"
      :row-style="rowStyle"
      @selection-change="HandleSelectChange"
      max-height="450px"
      v-loading="isLoading"
      element-loading-text="正在加载..."
      ref="tableRef"
    >
      <el-table-column type="selection" :selectable="selectable" width="50" />
      <el-table-column prop="faculty" label="所属院系" min-width="100px" />
      <el-table-column prop="admissionYear" label="年级" min-width="100px" />
      <el-table-column prop="className" label="班级名称" min-width="120px" />
      <el-table-column prop="lengthOfSchooling" label="学制" min-width="60px" />
      <el-table-column
        prop="educationLevel"
        label="培养层次"
        min-width="80px"
      />

      <el-table-column
        prop="isGraduated"
        label="是否已经毕业"
        :formatter="isGraduatedFormatter"
        min-width="90px"
      />
      <el-table-column prop="memberCount" label="班级人数" min-width="100px" />

      <el-table-column prop="majorName" label="专业" min-width="100px" />

      <el-table-column prop="classroomId" label="固定教室" min-width="100px" />

      <el-table-column label="操作" v-slot="scope" min-width="200px">
        <div class="RowButtons">
          <el-button type="info" @click="HandleShowInfoClick(scope.row)"
            >查看</el-button
          >
          <el-button type="primary" @click="HandleEditClick(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" @click="HandleDelete([scope.row])"
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
      :total="academicStore.classNum"
      :size="pageInfo.size"
      :page-sizes="[5, 10, 20, 50, 100, 200, 300]"
      :default-page-size="5"
      background
    />
  </div>
  <ClassEditDialog />
  <ClassInfoDrawerVue />
</template>

<script>
import bus from "@/bus/bus.js";
import { computed, reactive, toRefs, ref, onMounted } from "vue";
import ClassEditDialog from "./ClassEditDialog.vue";
import { storeToRefs } from "pinia";
import { useAcademicStore } from "@/store/academicStore";
import ClassInfoDrawerVue from "./ClassInfoDrawer.vue";
import { Search } from "@element-plus/icons-vue";
import { deleteClassApi } from "@/api/basicData/class.api.js";
import { getDepartmentListApi } from "@/api/basicData/departments.api.js";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  name: "ClassList",
  components: {
    ClassEditDialog,
    ClassInfoDrawerVue,
  },
  setup() {
    const academicStore = useAcademicStore();
    const { classes } = storeToRefs(academicStore);
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
    const faculties = ref([]);
    const facultyPageInfo = reactive({
      page: 0,
      size: 10,
      total: 0,
    });

    const majors = ref([]);
    const major = ref("*");

    const filtedArray = computed(() => {
      if (faculty.value == "*") {
        return classes.value;
      } else {
        return classes.value.filter((cl) => {
          return faculty.value == cl.faculty;
        });
      }
    });

    onMounted(() => {
      updateClassList(1, 5);
      getFaculty()
      bus.on("updateClassList", (isInitPage) => {
        if (isInitPage) {
          updateClassList(1, 5);
        } else {
          updateClassList(data.pageInfo.page, data.pageInfo.size);
        }
      });
    });

    const updateClassList = (page, size) => {
      data.isLoading = true;
      academicStore.getClasses({ page, size }).then((res) => {
        if (res === 200) {
          data.isLoading = false;
          tableRef.value.scrollTo(0, 0);
        }
      });
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
      academicStore
        .getClasses({ page, size: data.pageInfo.size })
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
        .getClasses({ page: data.pageInfo.page, size })
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
      bus.emit("showClassAdd");
    };

    const HandleEditClick = (value) => {
      bus.emit("showClassEdit", value);
    };

    const HandleShowInfoClick = (value) => {
      bus.emit("showClassInfoDrawer", value);
    };

    const isExpandingFormatter = (row) => {
      return row.isExpanding ? "是" : "否";
    };
    const isGraduatedFormatter = (row) => {
      return row.isGraduated ? "是" : "否";
    };

    const HandleDelete = (data) => {
      ElMessageBox.confirm("确认删除吗?", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteClass(data.map((c) => c.id));
      });
    };

    const deleteClass = (classList) => {
      deleteClassApi(classList).then((res) => {
        if (res) {
          if (res.code == 200) {
            updateClassList(1, data.pageInfo.size);
            ElMessage.success("操作成功!");
          }
        }
      });
    };

    const getFaculty = () => {
      if (
        facultyPageInfo.page == 0 ||
        facultyPageInfo.page * facultyPageInfo.size < facultyPageInfo.total
      ) {
        facultyPageInfo.page++;
        getDepartmentListApi({ page: facultyPageInfo.page, size: 10 }).then(
          (res) => {
            if (res) {
              if (res.meta.code === 200) {
                faculties.value = [...faculties.value, ...res.data.departments];
                facultyPageInfo.total = res.data.total;
              }
            }
          }
        );
      }
    };

    return {
      ...toRefs(data),
      classes,
      HandleSelectChange,
      HandleAddClick,
      HandleEditClick,
      HandleShowInfoClick,
      rowStyle,
      filtedArray,
      isExpandingFormatter,
      isGraduatedFormatter,
      tableRef,
      HandlePageChange,
      HandleSizeChange,
      academicStore,
      Search,

      HandleDelete,
      getFaculty,
      faculties
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

.filterSelector {
  width: 260px;
  margin-left: 10px;
}

.filters {
  display: inline-flex;
  flex-direction: row;
  margin: 10px 0px 20px 0px;
}
.filterLabel {
  margin-left: 20px;
}
</style>