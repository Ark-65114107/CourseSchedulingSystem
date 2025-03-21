<template>
  <div class="setCourseBody">
    <div></div>
    <div class="controlDiv">
      <div class="classTreeDiv">
        <el-text class="classTreeTitle">班级</el-text>
        <el-input placeholder="搜索班级" size="small" clearable></el-input>
        <el-scrollbar
          class="classTreeScrollBar"
          height="140px"
          v-loading="isLoading"
          always
        >
          <el-tree
            :data="classTree"
            :filter-node-method="treeFilter"
            node-key="id"
            default-expand-all
          />
        </el-scrollbar>
      </div>
      <!-- 
      <div>   :draggable="scope.row.cellList[scope.column.no - 1].hasCourse"
              @drop="(cell) => HandleCellDrop(cell, scope)"
              @dragstart="(cell) => HandleCellDragStart(cell, scope)"
              @dragend="(cell) => HandleCellDragEnd(cell, scope)"
              @dragover="(cell) => HandleCellDragOver(cell, scope)"
              @dragleave="(cell) => HandleCellDragLeave(cell, scope)"



               v-show="scope.row.cellList[scope.column.no - 1].hasCourse"

                               {{ scope.row.cellList[scope.column.no - 1].courseName }}<br />
                #{{ scope.row.cellList[scope.column.no - 1].teacherName }}
            </div> -->

      <el-tabs class="teachingClassTab" type="border-card" stretch>
        <el-tab-pane
          label="待排课"
          @dragover="HandleListDragOver"
          @drop="HandleTargetCellDrop"
        >
          <el-scrollbar class="teachingClassListScrollBar" height="150px">
            <div
              class="cellOptionDiv"
              v-for="tc of teachingClassList"
              v-show="tc.finishHour!=tc.totalHour"
              :draggable="true"
              @dragstart="(cell) => HandleTargetCellDragStart(cell, tc)"
              @dragend="HandleTargetCellDragEnd"
              @dragover="HandleTargetCellDragOver"
              @drop="HandleTargetCellDrop"
            >
              <span class="teachingClassCellTextSpan">
                {{ tc.courseName }}
              </span>
              <span class="teachingClassCellTextSpan"
                >#{{ tc.teacherName }}</span
              >
              <span class="teachingClassCellTextSpan">{{
                `(${tc.finishHour}/${tc.totalHour})`
              }}</span>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane
          label="已排课"
          @dragover="HandleListDragOver"
          @drop="HandleTargetCellDrop"
        >
          <el-scrollbar class="teachingClassListScrollBar" height="150px">
            <div
              class="cellOptionDiv"
              v-for="tc of teachingClassList"
              v-show="tc.finishHour>=tc.totalHour"
              :draggable="true"
              @dragstart="(cell) => HandleTargetCellDragStart(cell, tc)"
              @dragend="HandleTargetCellDragEnd"
              @dragover="HandleTargetCellDragOver"
              @drop="HandleTargetCellDrop"
            >
              <span class="teachingClassCellTextSpan">
                {{ tc.courseName }}
              </span>
              <span class="teachingClassCellTextSpan"
                >#{{ tc.teacherName }}</span
              >
              <span class="teachingClassCellTextSpan">{{
                `(${tc.finishHour}/${tc.totalHour})`
              }}</span>
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="scheduleDiv">
      <el-text class="className">21物联网技术应用</el-text>
      <div class="navDiv">
        <el-button type="primary">保存</el-button>
      </div>
      <div class="scheduleTableDiv">
        <!-- <span> </span> -->
        <el-table
          class="scheduleTable"
          :data="scheduleData"
          :border="true"
          max-height="320px"
          :span-method="tableSpan"
          :cell-style="setCellColor"
        >
          <el-table-column label="节次/周次" prop="periodColumn" width="100px">
            <template #default="scope">
              <span>第{{ scope.row.period }}节</span>
            </template>
          </el-table-column>

          <el-table-column
            class="courseColumn"
            width="115px"
            v-for="item of tableHeader"
            :label="item.name"
          >
            <template #default="scope">
              <div
                class="cellDiv"
                :draggable="scope.row.cellList[scope.column.no - 1].hasCourse"
                @drop="(cell) => HandleCellDrop(cell, scope)"
                @dragstart="(cell) => HandleCellDragStart(cell, scope)"
                @dragend="(cell) => HandleCellDragEnd(cell, scope)"
                @dragover="(cell) => HandleCellDragOver(cell, scope)"
                @dragleave="(cell) => HandleCellDragLeave(cell, scope)"
              >
                <span
                  class="cellText"
                  v-show="scope.row.cellList[scope.column.no - 1].hasCourse"
                >
                  {{ scope.row.cellList[scope.column.no - 1].courseName }}<br />
                  #{{ scope.row.cellList[scope.column.no - 1].teacherName }}
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { VueDraggable } from "vue-draggable-plus";
export default {
  name: "ScheduleBuild",
  components: {},
  setup() {
    const classTree = ref([
      {
        id: 1,
        label: "南浔校区",
        children: [
          {
            id: "wefsfgrdgr",
            label: "计算机科学与技术学院",
            children: [
              {
                id: 2,
                label: "软件工程",
                children: [
                  {
                    id: 3,
                    label: "2021级",
                    children: [
                      {
                        id: "21rgzb",
                        label: "21软件工程中本一体化1",
                        select: true,
                      },
                      {
                        id: "wqwqdsadwq",
                        label: "21软件工程1",
                        select: true,
                      },
                      {
                        id: "wqwqdsdsadadwq",
                        label: "21软件工程2",
                        select: true,
                      },
                    ],
                  },
                  {
                    id: 4,
                    label: "2022级",
                    children: [
                      {
                        id: "wqwqswq",
                        label: "22软件工程中本一体化1",
                        select: true,
                      },
                      {
                        id: "wqwqdsasdwq",
                        label: "22软件工程1",
                        select: true,
                      },
                      {
                        id: "wqwqsdsdsadadwq",
                        label: "22软件工程2",
                        select: true,
                      },
                    ],
                  },
                ],
              },
              {
                id: "ewefgfd",
                label: "计算机网络",
                children: [
                  {
                    id: "hgjgdsf",
                    label: "2021级",
                    children: [
                      {
                        id: "wqwqwdq",
                        label: "21计算机网络技术1",
                        select: true,
                      },
                      {
                        id: "wqwqfgfdgfddsadwq",
                        label: "21计算机网络技术2",
                        select: true,
                      },
                      {
                        id: "wqwqddasdasdsdsadadwq",
                        label: "21计算机网络技术3",
                        select: true,
                      },
                    ],
                  },
                  {
                    id: "dsagfd",
                    label: "2022级",
                    children: [
                      {
                        id: "wqwdsadasdqswq",
                        label: "22计算机网络技术1",
                        select: true,
                      },
                      {
                        id: "wqwqdsasddsfsdfwq",
                        label: "22计算机网络技术2",
                        select: true,
                      },
                      {
                        id: "wqwqsdsdghdsdsadadwq",
                        label: "22计算机网络技术3",
                        select: true,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "wefsfgrdgr",
            label: "计算机科学与技术学院",
            children: [
              {
                id: 2,
                label: "软件工程",
                children: [
                  {
                    id: 3,
                    label: "2021级",
                    children: [
                      {
                        id: "wqwqwq",
                        label: "21软件工程中本一体化1",
                        select: true,
                      },
                      {
                        id: "wqwqdsadwq",
                        label: "21软件工程1",
                        select: true,
                      },
                      {
                        id: "wqwqdsdsadadwq",
                        label: "21软件工程2",
                        select: true,
                      },
                    ],
                  },
                  {
                    id: 4,
                    label: "2022级",
                    children: [
                      {
                        id: "wqwqswq",
                        label: "22软件工程中本一体化1",
                        select: true,
                      },
                      {
                        id: "wqwqdsasdwq",
                        label: "22软件工程1",
                        select: true,
                      },
                      {
                        id: "wqwqsdsdsadadwq",
                        label: "22软件工程2",
                        select: true,
                      },
                    ],
                  },
                ],
              },
              {
                id: "ewefgfd",
                label: "计算机网络",
                children: [
                  {
                    id: "hgjgdsf",
                    label: "2021级",
                    children: [
                      {
                        id: "wqwqwdq",
                        label: "21计算机网络技术1",
                        select: true,
                      },
                      {
                        id: "wqwqfgfdgfddsadwq",
                        label: "21计算机网络技术2",
                        select: true,
                      },
                      {
                        id: "wqwqddasdasdsdsadadwq",
                        label: "21计算机网络技术3",
                        select: true,
                      },
                    ],
                  },
                  {
                    id: "dsagfd",
                    label: "2022级",
                    children: [
                      {
                        id: "wqwdsadasdqswq",
                        label: "22计算机网络技术1",
                        select: true,
                      },
                      {
                        id: "wqwqdsasddsfsdfwq",
                        label: "22计算机网络技术2",
                        select: true,
                      },
                      {
                        id: "wqwqsdsdghdsdsadadwq",
                        label: "22计算机网络技术3",
                        select: true,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]); //班级tree的数据

    const tableHeader = [
      { name: "星期一", prop: "MonData" },
      { name: "星期二", prop: "TueData" },
      { name: "星期三", prop: "WedData" },
      { name: "星期四", prop: "ThuData" },
      { name: "星期五", prop: "FriData" },
      { name: "星期六", prop: "SatData" },
      { name: "星期日", prop: "SunData" },
    ];

    const scheduleData = ref([
      {
        period: 1,
        cellList: [
          {
            hasCourse: true,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "C语言程序基础",
            teacherName: "小甲鱼",
          },
          {
            hasCourse: false,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: true,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "高等数学aaaaaaaaaaaaaaaaaaaaaaaa",
            teacherName: "宋浩",
          },
          {
            hasCourse: false,
            isAvailable: false,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: false,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
        ],
      },
      {
        period: 2,
        cellList: [
          {
            hasCourse: false,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: true,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "C语言程序基础",
            teacherName: "小甲鱼",
          },
          {
            hasCourse: true,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "高等数学",
            teacherName: "宋浩",
          },
          {
            hasCourse: false,
            isAvailable: false,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: false,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
        ],
      },
      {
        period: 3,
        cellList: [
          {
            hasCourse: false,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: true,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "C语言程序基础",
            teacherName: "小甲鱼",
          },
          {
            hasCourse: true,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "高等数学",
            teacherName: "宋浩",
          },
          {
            hasCourse: false,
            isAvailable: false,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: false,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
        ],
      },
      {
        period: 4,
        cellList: [
          {
            hasCourse: false,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: true,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "C语言程序基础",
            teacherName: "小甲鱼",
          },
          {
            hasCourse: true,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "高等数学",
            teacherName: "宋浩",
          },
          {
            hasCourse: false,
            isAvailable: false,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: false,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
        ],
      },
      {
        period: 5,
        cellList: [
          {
            hasCourse: false,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: false,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: false,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: false,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: true,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "高等数学",
            teacherName: "宋浩",
          },
          {
            hasCourse: false,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: false,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
        ],
      },
      {
        period: 6,
        cellList: [
          {
            hasCourse: true,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "高等数学",
            teacherName: "宋浩",
          },
          {
            hasCourse: false,
            isAvailable: false,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: false,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: false,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: true,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "高等数学",
            teacherName: "宋浩",
          },
        ],
      },
      {
        period: 7,
        cellList: [
          {
            hasCourse: false,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "C语言程序基础",
            teacherName: "小甲鱼",
          },
          {
            hasCourse: true,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "高等数学",
            teacherName: "宋浩",
          },
          {
            hasCourse: false,
            isAvailable: false,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: true,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "高等数学",
            teacherName: "宋浩",
          },
          {
            hasCourse: false,
            isAvailable: true,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
          {
            hasCourse: false,
            isAvailable: false,
            teachingClassId: "qwq",
            courseName: "",
            teacherName: "",
          },
        ],
      },
    ]);

    const teachingClassList = ref([
      {
        id: "qwqwqwq",
        courseName: "高等数学(一)aaaaaaaaaaaaaaaaa",
        teacherName: "宋浩aaaaaaaaaaaaaaa",
        consecutiveClassPeriods: 1,
        totalHour: 36,
        finishHour: 36,
      },
      {
        id: "qwqwqwsq",
        courseName: "高等数学(二)",
        teacherName: "宋浩",
        consecutiveClassPeriods: 2,
        totalHour: 36,
        finishHour: 0,
      },
      {
        id: "qwqwqwsq",
        courseName: "Java程序设计",
        teacherName: "黑马程序员",
        consecutiveClassPeriods: 2,
        totalHour: 120,
        finishHour: 0,
      },
      {
        id: "qwqwqw",
        courseName: "C语言程序基础A",
        teacherName: "王红霞",
        consecutiveClassPeriods: 2,
        totalHour: 60,
        finishHour: 0,
      },
      {
        id: "qwqwqw",
        courseName: "C语言程序基础B",
        teacherName: "王红霞",
        consecutiveClassPeriods: 2,
        totalHour: 100,
        finishHour: 0,
      },
      {
        id: "qwqwqw",
        courseName: "C语言程序进阶",
        teacherName: "王红霞",
        consecutiveClassPeriods: 1,
        totalHour: 120,
        finishHour: 0,
      },
      {
        id: "qwqwqw",
        courseName: "C#入门到入土",
        teacherName: "刘铁猛",
        consecutiveClassPeriods: 1,
        totalHour: 60,
        finishHour: 0,
      },
      {
        id: "qwqwqw",
        courseName: "Unity3D游戏开发",
        teacherName: "刘铁猛",
        consecutiveClassPeriods: 2,
        totalHour: 114,
        finishHour: 0,
      },
    ]);

    const totalTeachingClassNum = computed(()=>{
      
    })

    const treeFilter = (value, data) => {
      if (!value) return true;
      return data.label.includes(value);
    };

    const setCellColor = ({ row, column, rowIndex, columnIndex }) => {
      //根据单元格状态改变背景
      if (columnIndex > 0 && columnIndex < 8) {
        if (row.cellList[columnIndex - 1].isAvailable) {
          return { padding: "0px", height: "40px", width: "100px" };
        } else {
          return {
            background: "#DCDFE6",
            padding: "0px",
            height: "40px",
            width: "100px",
          };
        }
      }
    };

    const HandleCellDragOver = (cell, { row, column, cellIndex }) => {
      //被拖动的单元格经过
      if (row.cellList[column.no - 1].isAvailable) {
        cell.target.classList.add("cellHover"); //如果当前单元格没有课程且可用改变背景
        cell.preventDefault(); //使单元格允许drop
      }
    };

    const HandleCellDragLeave = (cell, { row, column, cellIndex }) => {
      //被拖动的单元格离开
      cell.target.classList.remove("cellHover");
    };

    const HandleCellDrop = (cell, { row, column, cellIndex }) => {
      //单元格被放下
      // //获取被拖动单元格的数据
      let cellType = cell.dataTransfer.getData("cellType");

      if (cellType === "tableCell") {
        let courseNameTemp = cell.dataTransfer.getData("courseName");
        let teacherNameTemp = cell.dataTransfer.getData("teacherName");
        let teachingClassIdTemp = cell.dataTransfer.getData("techingClassId");
        let periodTemp = cell.dataTransfer.getData("period");
        let columnIndexTemp = cell.dataTransfer.getData("columnIndex");
        let hasCourseTemp = cell.dataTransfer.getData("hasCourse");

        scheduleData.value[periodTemp - 1].cellList[
          columnIndexTemp
        ].courseName = row.cellList[column.no - 1].courseName;
        scheduleData.value[periodTemp - 1].cellList[
          columnIndexTemp
        ].teacherName = row.cellList[column.no - 1].teacherName;
        scheduleData.value[periodTemp - 1].cellList[
          columnIndexTemp
        ].teachingClassId = row.cellList[column.no - 1].teachingClassId;
        scheduleData.value[row.period - 1].cellList[column.no - 1].courseName =
          courseNameTemp;
        scheduleData.value[row.period - 1].cellList[column.no - 1].teacherName =
          teacherNameTemp;
        scheduleData.value[row.period - 1].cellList[
          column.no - 1
        ].teachingClassId = teachingClassIdTemp;
        scheduleData.value[periodTemp - 1].cellList[columnIndexTemp].hasCourse =
          row.cellList[column.no - 1].hasCourse;
        scheduleData.value[row.period - 1].cellList[column.no - 1].hasCourse =
          hasCourseTemp;
      }
      if (cellType === "targetCell") {
        let courseNameTemp = cell.dataTransfer.getData("courseName");
        let teacherNameTemp = cell.dataTransfer.getData("teacherName");
        let teachingClassIdTemp = cell.dataTransfer.getData("techingClassId");
        let hasCourseTemp = cell.dataTransfer.getData("hasCourse");
        scheduleData.value[row.period - 1].cellList[column.no - 1].courseName =
          courseNameTemp;
        scheduleData.value[row.period - 1].cellList[column.no - 1].teacherName =
          teacherNameTemp;
        scheduleData.value[row.period - 1].cellList[
          column.no - 1
        ].teachingClassId = teachingClassIdTemp;
        scheduleData.value[row.period - 1].cellList[column.no - 1].hasCourse =
          hasCourseTemp;
      }
      cell.target.classList.remove("cellHover");
    };

    const HandleCellDragStart = (cell, { row, column, cellIndex }) => {
      cell.dataTransfer.setData("cellType", "tableCell");
      cell.dataTransfer.setData(
        "hasCourse",
        row.cellList[column.no - 1].hasCourse
      );
      cell.dataTransfer.setData(
        "courseName",
        row.cellList[column.no - 1].courseName
      );
      cell.dataTransfer.setData(
        "teacherName",
        row.cellList[column.no - 1].teacherName
      );
      cell.dataTransfer.setData(
        "techingClassId",
        row.cellList[column.no - 1].teachingClassId
      );
      cell.dataTransfer.setData("period", row.period);
      cell.dataTransfer.setData("columnIndex", column.no - 1);
      cell.target.classList.add("cellDraging");
    };

    const HandleCellDragEnd = (cell, { row, column, cellIndex }) => {
      cell.target.classList.remove("cellDraging");
    };

    //<--------------------------------分割线---------------------------------->

    const HandleTargetCellDragStart = (cell, data) => {
      cell.dataTransfer.setData("cellType", "targetCell");
      cell.dataTransfer.setData("courseName", data.courseName);
      cell.dataTransfer.setData("hasCourse", true);
      cell.dataTransfer.setData("teacherName", data.teacherName);
      cell.dataTransfer.setData("techingClassId", data.id);
      cell.target.classList.add("targetCellDraging");
    };

    const HandleTargetCellDragEnd = (cell) => {
      cell.target.classList.remove("targetCellDraging");
    };
    const HandleTargetCellDragOver = (cell) => {
      cell.preventDefault(); //使单元格允许drop
    };
    const HandleListDragOver = (cell) => {
      cell.preventDefault(); //使单元格允许drop
    };

    const HandleTargetCellDrop = (cell) => {
      let cellType = cell.dataTransfer.getData("cellType");
      if (cellType === "tableCell") {
        let periodTemp = cell.dataTransfer.getData("period");
        let columnIndexTemp = cell.dataTransfer.getData("columnIndex");

        scheduleData.value[periodTemp - 1].cellList[
          columnIndexTemp
        ].courseName = "";
        scheduleData.value[periodTemp - 1].cellList[
          columnIndexTemp
        ].teacherName = "";
        scheduleData.value[periodTemp - 1].cellList[
          columnIndexTemp
        ].teachingClassId = "";
        scheduleData.value[periodTemp - 1].cellList[
          columnIndexTemp
        ].hasCourse = false;
      }
      cell.target.classList.remove("cellHover");
    };

    return {
      classTree,
      treeFilter,
      scheduleData,
      tableHeader,
      setCellColor,

      HandleCellDrop,
      HandleCellDragOver,
      HandleCellDragLeave,
      HandleCellDragStart,
      HandleCellDragEnd,
      HandleTargetCellDragStart,
      HandleTargetCellDragEnd,
      HandleTargetCellDrop,
      HandleTargetCellDragOver,
      HandleListDragOver,

      teachingClassList,
    };
  },
};
</script>

<style>
.setCourseBody {
  height: 420px;
  display: flex;
  margin: 10px 0px 0px 0px;
  padding: 10px;
  justify-content: space-between;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
  position: relative;
}

.controlDiv {
  height: auto;
  width: 30%;
  display: flex;
  flex-direction: column;
}

.classTreeDiv {
  height: 45%;
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: left;
  padding: 10px;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}
.teachingClassTab {
  height: 60%;
  width: auto;
  display: flex;
  margin-top: 10px;
  justify-content: space-between;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
}

.classTreeTitle {
  margin: 3px 0px;
  font-size: 16px;
  font-weight: bold;
  justify-self: left;
}

.classTreeScrollBar {
  width: 100%;
}

.scheduleDiv {
  width: 70%;
  margin-left: 10px;
  padding: 10px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
  position: relative;
  right: 0px;
}

.scheduleTableDiv {
  width: auto;
  height: auto;
}

.scheduleTable {
  height: 100%;
}
.formItemTitle {
  font-weight: bold;
  margin: 20px 0px;
}
.menuTitle {
  font-weight: bold;
  font-size: 20px;
  margin: 5px 0px;
}

.navDiv {
  width: 100%;
  height: 30px;
  margin: 10px 0px;
  display: flex;
  flex-direction: row;
}

.stateMenu {
  width: auto;
  height: 50px;
  margin-top: 10px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.cellDiv {
  height: 40px;
  width: 115px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

.cell:has(.cellDiv) {
  height: 40px;
  width: 100%;
  padding: 0px;
  margin: 0px;
  line-height: 15px;
}
.cellText {
  font-size: 10px;
  height: 100%;
  width: 100%;
  line-height: 20px;
  text-align: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cellText * {
  min-width: 0;
}

.className {
  font-weight: bold;
  font-size: 15px;
}

.cellHover {
  background: rgb(197.7, 225.9, 255);
}

.cellDraging {
  height: 40px;
  width: 115px;
  display: flex;
  justify-content: center;
  opacity: 0.4;
  box-sizing: border-box;
  border: dashed 1px rgb(121.3, 187.1, 255);
}

.teachingClassTab .el-tabs__content {
  padding: 0px;
}

.teachingClassListScrollBar {
  width: auto;
  margin: 5px;
}

.teachingClassListScrollBar .el-scrollbar__wrap {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.teachingClassListScrollBar .el-scrollbar__wrap .el-scrollbar__view {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.cellOptionDiv {
  height: 40px;
  width: 100px;
  margin: 5px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.teachingClassCellTextSpan {
  font-size: 11px;

  height: 15px;
  width: 100%;
  text-align: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.targetCellDraging {
  opacity: 0.4;
  border: dashed 1px rgb(121.3, 187.1, 255);
}
</style>