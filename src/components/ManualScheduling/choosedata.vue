<template>
  <div class="table">
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      row-key="工号"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="工号" width="120" prop="工号" />
      <el-table-column property="姓名" label="姓名" width="120" />
      <el-table-column property="性别" label="性别" width="120" />
      <el-table-column property="单位" label="单位" />
      <el-table-column property="是否外聘" label="是否外聘" />
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
  工号: number;
  姓名: string
  性别: string
  单位: string
  是否外聘: string
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
    工号: 1,
    姓名: 'Tom',
    性别: '男',
    单位: '技术部',
    是否外聘: '否',
  },
  {
    工号: 2,
    姓名: 'Tom',
    性别: '男',
    单位: '技术部',
    是否外聘: '否',
  },
  {
    工号: 3,
    姓名: 'Tom',
    性别: '男',
    单位: '技术部',
    是否外聘: '否',
  },
  {
    工号: 4,
    姓名: 'Tom',
    性别: '男',
    单位: '技术部',
    是否外聘: '否',
  },
  {
    工号: 5,
    姓名: 'Tom',
    性别: '男',
    单位: '技术部',
    是否外聘: '否',
  },
  {
    工号: 6,
    姓名: 'Tom',
    性别: '男',
    单位: '技术部',
    是否外聘: '否',
  },
  {
    工号: 7,
    姓名: 'Tom',
    性别: '男',
    单位: '技术部',
    是否外聘: '否',
  },
]
</script>

<style scoped>

</style>