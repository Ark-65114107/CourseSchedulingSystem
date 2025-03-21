<template>
  <div class="table">
    <el-table
      ref="multipleTableRef"
      :data="currentPageData"
      row-key="id"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="编号" width="60" prop="id" />
      <el-table-column label="学年学期" width="120" prop="term" />
      <el-table-column label="课程编号" width="120" prop="courseNumber" />
      <el-table-column label="教师工号" width="120" prop="teacherId" />
      <el-table-column label="任课教师" width="120" prop="teacherName" />
      <el-table-column label="是否外聘" width="120" prop="isOutside" />
      <el-table-column property="unit" label="单位" />
      <el-table-column property="classComponent" label="教学班组成" />
      <el-table-column property="className" label="教学班名称" />
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      @current-change="handleCurrentChange"
    />
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection()">清空选项</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup name="choosedata">
import { ref, onMounted } from "vue";
import type { TableInstance } from "element-plus";
import { all } from "axios";
import { getTaskListApi } from "@/api/schedule/task/tabledata.api";
import { closeSync } from "fs";

const total = ref(1000);
const pageSize = ref(10);
const currentPage = ref(1);
const allData = ref<User[]>([]);
const currentPageData = ref<User[]>([]);

const fetchData = (page, size) => {
  //从后端获取数据
  return getTaskListApi({ page, size }).then((res) => {
    console.log("qwqw",res);
    allData.value = res.data.users;
    currentPageData.value = allData.value;
  });
};

const handleCurrentChange = (newpage) => {
  currentPage.value = newpage;
  fetchData(currentPage.value, pageSize.value);
};

const getData = () => {
  fetchData(currentPage.value, pageSize.value);
};

onMounted(() => {
  getData();
});

interface User {
  id: number;
  term: string;
  courseNumber: string;
  teacherId: string;
  teacherName: string;
  isOutside: Boolean;
  unit: string;
  classComponent: string;
  className: string;
}

const multipleTableRef = ref<TableInstance>();
const multipleSelection = ref<User[]>([]);

const toggleSelection = (rows?: User[], ignoreSelectable?: boolean) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value!.toggleRowSelection(
        row,
        undefined,
        ignoreSelectable
      );
    });
  } else {
    multipleTableRef.value!.clearSelection();
  }
};
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};
</script>

<style scoped>
</style>


