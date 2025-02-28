<template>
  <h1>课表查看</h1>
  <hr>
  <div class="Table">
    <el-table
    class="scheduleList"
    :data="tableData"
    height="600"
    style="width: 100%"
    :row-class-name="tableRowClassName"
  >
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
  </div>
</template>

<script lang="ts" setup name="ShowSchedule">
interface User {
  date: string
  name: string
  address: string
}

const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: User
  rowIndex: number
}) => {
  if (rowIndex === 1) {
    return 'warning-row'
  } else if (rowIndex === 3) {
    return 'success-row'
  }
  return ''
}

const tableData: User[] = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>

<style >
.scheduleList .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.scheduleList .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
.scheduleList{
  border: 3px solid black;
}
.scheduleList th,.scheduleList td {
      border: 1px solid gray; /* 灰色边框 */
      padding: 8px;
      text-align: left;
    }
</style>