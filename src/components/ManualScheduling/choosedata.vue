<template>
  <div class="table">
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      row-key="编号"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="编号" width="60" prop="选项编号" />
      <el-table-column label="学年学期" width="120" prop="学年学期" />
      <el-table-column label="课程编号" width="120" prop="课程编号" />
      <el-table-column label="教师工号" width="120" prop="教师工号" />
      <el-table-column label="任课教师" width="120" prop="任课教师" />
      <el-table-column label="是否外聘" width="120" prop="是否外聘" />
      <el-table-column property="单位" label="单位" />
      <el-table-column property="教学班组成" label="教学班组成" />
      <el-table-column property="教学班名称" label="教学班名称" />
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection()">清空选项</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup name="choosedata">
import { ref } from 'vue'
import type { TableInstance } from 'element-plus'

interface User {
  编号:number
  学年学期:string
  课程编号:string
  教师工号: string
  任课教师: string
  是否外聘: string
  单位: string
  教学班组成: string
  教学班名称: string
}

const multipleTableRef = ref<TableInstance>()
const multipleSelection = ref<User[]>([])


const toggleSelection = (rows?: User[], ignoreSelectable?: boolean) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value!.toggleRowSelection(
        row,
        undefined,
        ignoreSelectable
      )
    })
  } else {
    multipleTableRef.value!.clearSelection()
  }
}
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}

const tableData: User[] = [
  {
    编号:1,
    学年学期:'2021-2022-1',
    课程编号:'',
    教师工号: '085',
    任课教师: '',
    是否外聘: '',
    单位: '',
    教学班组成: '',
    教学班名称: '',
  },
  {
    编号:2,
    学年学期:'2021-2022-1',
    课程编号:'',
    教师工号: '085',
    任课教师: '',
    是否外聘: '',
    单位: '',
    教学班组成: '',
    教学班名称: '',
  },
  {
    编号:3,
    学年学期:'2021-2022-1',
    课程编号:'',
    教师工号: '085',
    任课教师: '',
    是否外聘: '',
    单位: '',
    教学班组成: '',
    教学班名称: '',
  },
  {
    编号:4,
    学年学期:'2021-2022-1',
    课程编号:'',
    教师工号: '085',
    任课教师: '',
    是否外聘: '',
    单位: '',
    教学班组成: '',
    教学班名称: '',
  },
  {
    编号:5,
    学年学期:'2021-2022-1',
    课程编号:'',
    教师工号: '085',
    任课教师: '',
    是否外聘: '',
    单位: '',
    教学班组成: '',
    教学班名称: '',
  },
  {
    编号:6,
    学年学期:'2021-2022-1',
    课程编号:'',
    教师工号: '085',
    任课教师: '',
    是否外聘: '',
    单位: '',
    教学班组成: '',
    教学班名称: '',
  },
  {
    编号:7,
    学年学期:'2021-2022-1',
    课程编号:'',
    教师工号: '085',
    任课教师: '',
    是否外聘: '',
    单位: '',
    教学班组成: '',
    教学班名称: '',
  },
]
</script>

<style scoped>

</style>