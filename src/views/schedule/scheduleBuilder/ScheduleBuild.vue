<template>
  <div class="scheduleBuildBody">
    <div class="controlPart">
      <el-button type="warning" @click="HandleAiClick">自动排课</el-button>
    </div>
    <div class="workPart">
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
              @node-click="HandleTreeNodeClick"
            >
              <template #default="{ node, data }">
                <div class="treeNode">
                  <el-text>{{ node.label }}</el-text>
                  <el-text v-if="data.select">({{}})</el-text>
                </div>
              </template>
            </el-tree>
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
            :label="`待排课(${
              totalTeachingClassNum - finishedTeachingClassNum
            })`"
            @dragover="HandleListDragOver"
            @drop="HandleTargetCellDrop"
          >
            <el-scrollbar class="teachingClassListScrollBar" height="150px">
              <div
                class="cellOptionDiv"
                v-for="tc of teachingClassList"
                v-show="tc.finishHour < tc.totalHour"
                :draggable="true"
                @dragstart="(cell) => HandleTargetCellDragStart(cell, tc)"
                @dragend="HandleTargetCellDragEnd"
                @dragover="HandleTargetCellDragOver"
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
            :label="`已排课(${finishedTeachingClassNum})`"
            @dragover="HandleListDragOver"
            @drop="HandleTargetCellDrop"
          >
            <el-scrollbar class="teachingClassListScrollBar" height="150px">
              <div
                class="cellOptionDiv"
                v-for="tc of teachingClassList"
                v-show="tc.finishHour >= tc.totalHour"
                :draggable="true"
                @dragstart="(cell) => HandleTargetCellDragStart(cell, tc)"
                @dragend="HandleTargetCellDragEnd"
                @dragover="HandleTargetCellDragOver"
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
        <el-text class="className">班级名:{{ currentClassName }}</el-text>
        <div class="navDiv"></div>
        <div class="scheduleTableDiv">
          <!-- <span> </span> -->
          <el-table
            class="scheduleTable"
            :data="scheduleData"
            :border="true"
            max-height="350px"
            :span-method="tableSpan"
            :cell-style="setCellColor"
            row-class-name="rowClass"
            fit
          >
            <el-table-column label="节次/周次" prop="periodColumn">
              <template #default="scope">
                <span>第{{ scope.row.period }}节</span>
              </template>
            </el-table-column>

            <el-table-column
              class="courseColumn"
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
                    {{ scope.row.cellList[scope.column.no - 1].courseName
                    }}<br />
                    #{{ scope.row.cellList[scope.column.no - 1].teacherName }}
                  </span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
  <aiScheduleDialogVue />
</template>

<script>
import { computed, ref } from "vue";
import { getTeachingClassListApi } from "@/api/schedule/scheduleBuild/teachingClassList.api.js";
import { getScheduleDataApi } from "@/api/schedule/scheduleBuild/scheduleData.api.js";
import { useRoute } from "vue-router";
import aiScheduleDialogVue from "./AiScheduleDialog.vue";
import bus from "@/bus/bus";
export default {
  name: "ScheduleBuild",
  components: { aiScheduleDialogVue },
  setup() {
    const taskId = useRoute().query.id;

    const currentClassName = ref("");

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
                    label: "2023级",
                    children: [
                      {
                        id: "rgzb23",
                        label: "23软件工程中本一体化",
                        select: true,
                      },
                    ],
                  },
                  {
                    id: 4,
                    label: "2024级",
                    children: [
                      {
                        id: "rgzb24",
                        label: "24软件工程中本一体化",
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
    const scheduleData = ref([]);

    const teachingClassList = ref([
      // {
      //   id: "gs1",
      //   courseName: "高等数学(一)",
      //   teacherName: "宋浩",
      //   consecutiveClassPeriods: 1,
      //   totalHour: 36,
      //   finishHour: 36,
      // },
      // {
      //   id: "gs2",
      //   courseName: "高等数学(二)",
      //   teacherName: "宋浩",
      //   consecutiveClassPeriods: 2,
      //   totalHour: 36,
      //   finishHour: 0,
      // },
      // {
      //   id: "java",
      //   courseName: "Java程序设计",
      //   teacherName: "黑马程序员",
      //   consecutiveClassPeriods: 2,
      //   totalHour: 120,
      //   finishHour: 0,
      // },
      // {
      //   id: "ca",
      //   courseName: "C语言程序基础A",
      //   teacherName: "王红霞",
      //   consecutiveClassPeriods: 2,
      //   totalHour: 60,
      //   finishHour: 0,
      // },
      // {
      //   id: "cb",
      //   courseName: "C语言程序基础B",
      //   teacherName: "王红霞",
      //   consecutiveClassPeriods: 2,
      //   totalHour: 100,
      //   finishHour: 0,
      // },
      // {
      //   id: "cpro",
      //   courseName: "C语言程序进阶",
      //   teacherName: "王红霞",
      //   consecutiveClassPeriods: 1,
      //   totalHour: 120,
      //   finishHour: 0,
      // },
      // {
      //   id: "cjjjjj",
      //   courseName: "C#入门到入土",
      //   teacherName: "刘铁猛",
      //   consecutiveClassPeriods: 1,
      //   totalHour: 60,
      //   finishHour: 0,
      // },
      // {
      //   id: "u3d",
      //   courseName: "Unity3D游戏开发",
      //   teacherName: "刘铁猛",
      //   consecutiveClassPeriods: 2,
      //   totalHour: 114,
      //   finishHour: 0,
      // },
    ]);

    const totalTeachingClassNum = computed(() => {
      return teachingClassList.value.length;
    });

    const finishedTeachingClassNum = computed(() => {
      return teachingClassList.value.filter((tc) => {
        return tc.finishHour >= tc.totalHour;
      }).length;
    });

    const CurrentDragCellData = ref({});

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
      if (CurrentDragCellData.value.cellData) {
        let ClassPeriodsTemp =
          CurrentDragCellData.value.cellData.consecutiveClassPeriods;
        if (ClassPeriodsTemp == 1) {
          if (row.cellList[column.no - 1].isAvailable) {
            cell.preventDefault(); //使单元格允许drop
            cell.target.classList.add("cellHover"); //如果当前单元格没有课程且可用改变背景
          }
        } else {
          if (row.period < scheduleData.value.length - ClassPeriodsTemp + 2) {
            let counter = 0;
            for (let p = 0; p < ClassPeriodsTemp; p++) {
              if (p == 0) {
                if (
                  row.cellList[column.no - 1].isAvailable &&
                  !row.cellList[column.no - 1].hasCourse
                ) {
                  counter++;
                  continue;
                }
              } else {
                if (
                  scheduleData.value[row.period + p - 1].cellList[column.no - 1]
                    .isAvailable &&
                  !scheduleData.value[row.period + p - 1].cellList[
                    column.no - 1
                  ].hasCourse
                ) {
                  counter++;
                  continue;
                }
              }
            }

            if (counter == ClassPeriodsTemp) {
              cell.preventDefault(); //使单元格允许drop
              cell.target.classList.add("cellHover");

              let currentRow = cell.target.closest("tr");
              for (let p = 1; p < ClassPeriodsTemp; p++) {
                if (currentRow) {
                  if (currentRow.nextElementSibling) {
                    let nextCell =
                      scheduleData.value[row.period + p - 1].cellList[
                        column.no - 1
                      ].cellIndex;

                    if (nextCell) {
                      currentRow.nextElementSibling.cells[
                        nextCell
                      ].classList.add("cellHover");
                    }
                  }
                }
                currentRow = currentRow.nextElementSibling;
              }
            } else {
              if (row.cellList[column.no - 1].isAvailable) {
                cell.target.classList.add("cellHoverProhibited");
              }
            }
          } else {
            if (row.cellList[column.no - 1].isAvailable) {
              cell.target.classList.add("cellHoverProhibited");
            }
          }
        }
      }
    };

    const HandleCellDragLeave = (cell, { row, column, cellIndex }) => {
      //被拖动的单元格离开
      cell.target.classList.remove("cellHover");
      cell.target.classList.remove("cellHoverProhibited");
      let ClassPeriodsTemp =
        CurrentDragCellData.value.cellData.consecutiveClassPeriods;

      if (row.period < scheduleData.value.length - ClassPeriodsTemp + 2) {
        let currentRow = cell.target.closest("tr");
        for (let p = 1; p < ClassPeriodsTemp; p++) {
          if (currentRow) {
            if (currentRow.nextElementSibling) {
              let nextCell =
                scheduleData.value[row.period + p - 1].cellList[column.no - 1]
                  .cellIndex;

              if (nextCell) {
                currentRow.nextElementSibling.cells[nextCell].classList.remove(
                  "cellHover"
                );
              }
            }
          }
          currentRow = currentRow.nextElementSibling;
        }
      }
    };

    const HandleCellDrop = (cell, { row, column, cellIndex }) => {
      //单元格被放下
      // //获取被拖动单元格的数据
      // let cellType = cell.dataTransfer.getData("cellType");
      let cellType = CurrentDragCellData.value.cellType;
      if (cellType === "tableCell") {
        let periodTemp = CurrentDragCellData.value.period;
        let columnIndexTemp = CurrentDragCellData.value.columnIndex;
        let courseNameTemp = CurrentDragCellData.value.cellData.courseName;
        let teacherNameTemp = CurrentDragCellData.value.cellData.teacherName;
        let teachingClassIdTemp =
          CurrentDragCellData.value.cellData.teachingClassId;
        let consecutiveClassPeriodsTemp =
          CurrentDragCellData.value.cellData.consecutiveClassPeriods;
        let hasCourseTemp = CurrentDragCellData.value.cellData.hasCourse;

        scheduleData.value[periodTemp - 1].cellList[
          columnIndexTemp
        ].courseName = row.cellList[column.no - 1].courseName;

        scheduleData.value[periodTemp - 1].cellList[
          columnIndexTemp
        ].consecutiveClassPeriods =
          row.cellList[column.no - 1].consecutiveClassPeriods;

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

        scheduleData.value[row.period - 1].cellList[
          column.no - 1
        ].consecutiveClassPeriods = consecutiveClassPeriodsTemp;

        scheduleData.value[periodTemp - 1].cellList[columnIndexTemp].hasCourse =
          row.cellList[column.no - 1].hasCourse;

        scheduleData.value[row.period - 1].cellList[
          column.no - 1
        ].hasCourse = true;
      }
      if (cellType === "targetCell") {
        let courseNameTemp = CurrentDragCellData.value.cellData.courseName;
        let teacherNameTemp = CurrentDragCellData.value.cellData.teacherName;
        let teachingClassIdTemp = CurrentDragCellData.value.cellData.id;
        let consecutiveClassPeriodsTemp =
          CurrentDragCellData.value.cellData.consecutiveClassPeriods;

        let hasCourseTemp = true;

        const targetItem =
          teachingClassList.value[
            teachingClassList.value.findIndex(
              (tc) => tc.id === teachingClassIdTemp
            )
          ];
        scheduleData.value[row.period - 1].cellList[column.no - 1].courseName =
          courseNameTemp;
        scheduleData.value[row.period - 1].cellList[column.no - 1].teacherName =
          teacherNameTemp;
        scheduleData.value[row.period - 1].cellList[
          column.no - 1
        ].teachingClassId = teachingClassIdTemp;
        scheduleData.value[row.period - 1].cellList[column.no - 1].hasCourse =
          hasCourseTemp;
        scheduleData.value[row.period - 1].cellList[
          column.no - 1
        ].consecutiveClassPeriods = consecutiveClassPeriodsTemp;
        targetItem.finishHour += targetItem.consecutiveClassPeriods;
      }
      cell.target.classList.remove("cellHover");

      let ClassPeriodsTemp =
        CurrentDragCellData.value.cellData.consecutiveClassPeriods;

      if (row.period < scheduleData.value.length - ClassPeriodsTemp + 2) {
        let currentRow = cell.target.closest("tr");
        for (let p = 1; p < ClassPeriodsTemp; p++) {
          if (currentRow) {
            if (currentRow.nextElementSibling) {
              let nextCell =
                scheduleData.value[row.period + p - 1].cellList[column.no - 1]
                  .cellIndex;

              if (nextCell) {
                currentRow.nextElementSibling.cells[nextCell].classList.remove(
                  "cellHover"
                );
              }
            }
          }
          currentRow = currentRow.nextElementSibling;
        }
      }
    };

    const HandleCellDragStart = (cell, { row, column, cellIndex }) => {
      // CurrentDragCell.value.consecutiveClassPeriods =
      //   row.cellList[column.no - 1].consecutiveClassPeriods;
      CurrentDragCellData.value.cellType = "tableCell";
      CurrentDragCellData.value.cellData =
        scheduleData.value[row.period - 1].cellList[column.no - 1];
      CurrentDragCellData.value.period = row.period;
      CurrentDragCellData.value.columnIndex = column.no - 1;

      cell.target.classList.add("cellDraging");
    };

    const HandleCellDragEnd = (cell, { row, column, cellIndex }) => {
      cell.target.classList.remove("cellDraging");
      let currentRow = cell.target.closest("tr");
      if (currentRow) {
        if (currentRow.nextElementSibling) {
          console.log(cellIndex);
          console.log(currentRow.nextElementSibling.cells.length);
          let nextCell =
            cellIndex -
            (scheduleData.value.length +
              1 -
              currentRow.nextElementSibling.cells.length);
          if (cellIndex == 1) {
            currentRow.nextElementSibling.cells[1].classList.remove(
              "cellHover"
            );
          } else {
            if (nextCell != 0) {
              currentRow.nextElementSibling.cells[nextCell].classList.remove(
                "cellHover"
              );
            }
          }
        }
      }
      CurrentDragCellData.value = {};
      // CurrentDragCell.value = {};
    };

    //<--------------------------------分割线---------------------------------->

    const HandleTargetCellDragStart = (cell, data) => {
      CurrentDragCellData.value = { cellType: "targetCell", cellData: data };
      // CurrentDragCell.value.consecutiveClassPeriods =data.consecutiveClassPeriods;
      cell.target.classList.add("targetCellDraging");
    };

    const HandleTargetCellDragEnd = (cell) => {
      cell.target.classList.remove("targetCellDraging");
      CurrentDragCellData.value = {};
      // CurrentDragCell.value = {};
    };
    const HandleTargetCellDragOver = (cell) => {
      if (CurrentDragCellData.value.cellData) {
        cell.preventDefault(); //使单元格允许drop
      }
    };
    const HandleListDragOver = (cell) => {
      if (CurrentDragCellData.value.cellData) {
        cell.preventDefault(); //使单元格允许drop
      }
    };

    const HandleTargetCellDrop = (cell) => {
      let cellType = CurrentDragCellData.value.cellType;
      if (cellType === "tableCell") {
        let periodTemp = CurrentDragCellData.value.period;
        let columnIndexTemp = CurrentDragCellData.value.columnIndex;
        let teachingClassIdTemp =
          CurrentDragCellData.value.cellData.teachingClassId;

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

        const targetItem =
          teachingClassList.value[
            teachingClassList.value.findIndex(
              (tc) => tc.id === teachingClassIdTemp
            )
          ];
        targetItem.finishHour -= targetItem.consecutiveClassPeriods;
      }
      cell.target.classList.remove("cellHover");
    };

    const HandleTreeNodeClick = (node) => {
      if (node.select) {
        currentClassName.value = node.label;
        getTeachingClassList(taskId, node.id);
        getScheduleData(taskId, node.id);
      }
    };

    const setListRowspan = (List) => {
      List.forEach((item) => {
        for (let i = 0; i < item.cellList.length; i++) {
          item.cellList[i].rowspan = 1;
        }
      });
      for (let i = 0; i < List.length; i++) {
        let cellIndexTemp = 1;
        for (let j = 0; j < List[i].cellList.length; j++) {
          if (List[i].cellList[j].consecutiveClassPeriods == 1) {
            List[i].cellList[j].rowspan = 1;
            List[i].cellList[j].cellIndex = cellIndexTemp;
            cellIndexTemp++;
          } else {
            List[i].cellList[j].rowspan =
              List[i].cellList[j].consecutiveClassPeriods;

            List[i].cellList[j].cellIndex = null;
            if (i < List.length - 1) {
              console.log(i, j);
              for (let k = i + 1; k < i + List[i].cellList[j].rowspan; k++) {
                List[k].cellList[j].rowspan = 0;
                List[k].cellList[j].consecutiveClassPeriods = 0;
                List[k].cellList[j].cellIndex = cellIndexTemp;
                cellIndexTemp++;
              }
            }
          }
          // List[i].rowspan=List[i].consecutiveClassPeriods;
          // List[j].rowspan--;
        }
        // i = i + List[i].rowspan - 1;
      }
      return List;
    };

    //在连堂课时合并单元格
    const tableSpan = ({ row, column, rowIndex, columnIndex }) => {
      if (columnIndex != 0) {
        if (
          scheduleData.value[rowIndex].cellList[columnIndex - 1].rowspan <= 0
        ) {
          return [0, 0];
        } else {
          return [
            scheduleData.value[rowIndex].cellList[columnIndex - 1].rowspan,
            1,
          ];
        }
      } else {
        return [1, 1];
      }
    };

    //====================================下面是api数据获取部分======================================

    //根据tree选中的班级id请求对应班级的教学班
    const getTeachingClassList = (taskId, classId) => {
      getTeachingClassListApi(taskId, classId).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            teachingClassList.value = res.data;
          }
        }
      });
    };

    //根据tree选中的班级id请求对应班级的课表信息
    const getScheduleData = (taskId, classId) => {
      getScheduleDataApi(taskId, classId).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            console.log(res);
            scheduleData.value = setListRowspan(res.data);
          }
        }
      });
    };

    const updateScheduleData = (taskId, classId, data) => {};

    const HandleAiClick = () => {
      bus.emit("showAiScheduleDialog");
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

      HandleTreeNodeClick,

      getTeachingClassList,

      currentClassName,
      getScheduleData,
      finishedTeachingClassNum,
      totalTeachingClassNum,

      HandleAiClick,
      tableSpan,
      CurrentDragCellData,
    };
  },
};
</script>

<style>
.scheduleBuildBody {
  height: auto;
  margin: 10px 0px 0px 0px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
  position: relative;
}

.controlPart {
  height: 35px;
  margin-bottom: 10px;
}

.workPart {
  height: auto;
  width: auto;
  display: flex;
  padding: 10px;
  justify-content: space-between;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
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
  width: 100%;
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
  height: 20px;
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
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

.cell:has(.cellDiv) {
  height: 100%;
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
  align-content: center;
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
  background: rgb(197.7, 225.9, 255) !important;
}

.cellHoverProhibited {
  background: #ff4d5f;
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