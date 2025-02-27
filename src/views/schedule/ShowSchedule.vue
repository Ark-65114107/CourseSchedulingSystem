<template>
  <h1>课表查看</h1>
  <hr>
  <div class="Table">
    <el-table
    :data="tableData"
    height="590"
    style="width: 1200px"
    :row-class-name="tableRowClassName"
  >
    <el-table-column prop="ClassTime" label="节次/时间" width="200" />
    <el-table-column prop="Monday" label="星期一" width="200" />
    <el-table-column prop="Tuesday" label="星期二" width="200" />
    <el-table-column prop="Wednesday" label="星期三" width="200" />
    <el-table-column prop="Thursday" label="星期四" width="200" />
    <el-table-column prop="Friday" label="星期五" width="200" />
  </el-table>
  </div>
</template>

<script lang="ts" setup name="ShowSchedule">
interface User {
  ClassTime: string
  Monday: string
  Tuesday: string
  Wednesday: string
  Thursday: string
  Friday: string
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
    ClassTime:'第一节(08:10-08:50)',
    Monday: '11',
    Tuesday: '11',
    Wednesday: '11',
    Thursday: '',
    Friday: '',
  },
  {
    ClassTime:'第二节(08:55-09:35)',
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
  },
  {
    ClassTime:'第三节(09:50-10:30)',
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
  },
  {
    ClassTime:'第四节(10:35-11:15)',
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
  },
  {
    ClassTime:'第五节(11:20-12:00)',
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
  },
  {
    ClassTime:'第六节(13:30-14:10)',
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
  },
  {
    ClassTime:'第七节(14:15-14:55)',
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
  },
  {
    ClassTime:'第八节(15:05-15:45)',
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
  },
  {
    ClassTime:'第九节(15:50-16:30)',
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
  },
  {
    ClassTime:'第十节(18:00-18:40)',
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
  },
  {
    ClassTime:'第十一节(18:45-19:25)',
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
  },
  {
    ClassTime:'第十二节(19:30-20:10)',
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
  },
]
</script>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
.el-table{
  border: 3px solid black;
}
.el-table th, td {
      border: 1px solid gray; /* 灰色边框 */
      padding: 8px;
      text-align: left;
      height: 45px;
    }
.el-table th{
  
}
</style>