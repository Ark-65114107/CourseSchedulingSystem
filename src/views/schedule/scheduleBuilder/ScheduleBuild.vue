<template>
  <div class="scheduleBuildBody">
    <div class="controlPart">
      <el-button size="small" type="warning" @click="HandleAiClick"
        >自动排课</el-button
      >
    </div>
    <div class="workPart">
      <div class="controlDiv">
        <div class="classTreeDiv">
          <el-text class="classTreeTitle">班级</el-text>
          <el-input
            v-model="treeKeyword"
            placeholder="搜索班级"
            size="small"
            clearable
          ></el-input>
          <el-scrollbar
            class="classTreeScrollBar"
            height="140px"
            v-loading="isLoading"
            always
          >
            <el-tree
              :data="classTree"
              :filter-node-method="treeFilter"
              v-loading="isTreeLoading"
              ref="treeRef"
              node-key="id"
              default-expand-all
              @node-click="HandleTreeNodeClick"
            >
              <template #default="{ node, data }">
                <div class="treeNode">
                  <el-text v-if="data.select" style="font-weight: bold">{{
                    node.label
                  }}</el-text>
                  <el-text v-else>{{ node.label }}</el-text>
                  <el-text v-if="data.select">({{ data.courseNum }})</el-text>
                </div>
              </template>
            </el-tree>
          </el-scrollbar>
        </div>
        <!-- 
      <div>   :draggable="scope.row.cellList[scope.column.no - 1].hasCourse"
              @drop="(cell) => HandleCellDrop(cell, scope)"
              @dragstart="(cell) => HandleTeachingClassDragStart(cell, scope)"
              @dragend="(cell) => HandleTeachingClassDragEnd(cell, scope)"
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
            <el-scrollbar class="teachingClassListScrollBar" height="200px">
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
                <span class="teachingClassCellTextSpan">{{
                  teacherNameFormatter(tc.teacherList)
                }}</span>
                <span class="teachingClassCellTextSpan"
                  >连排节次:{{ tc.consecutiveClassPeriods }}</span
                >
                <span class="teachingClassCellTextSpan">{{
                  weeksDataFormatter(tc.weeksData)
                }}</span>
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
            <el-scrollbar class="teachingClassListScrollBar" height="200px">
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
                <span class="teachingClassCellTextSpan">
                  {{ teacherNameFormatter(tc.teacherList) }}
                </span>
                <span class="teachingClassCellTextSpan">{{
                  weeksDataFormatter(tc.weeksData)
                }}</span>
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
        <div class="navDiv">
          <el-select
            class="weekSelect"
            size="small"
            placeholder="请选择周次"
            v-model="currentWeek"
            @change="HandleWeekSelect"
          >
            <el-option label="全部周次" :value="-1" />
            <el-option
              v-for="week of maxWeek"
              :label="`第${week}周`"
              :value="week"
            />
          </el-select>
        </div>
        <div class="scheduleTableDiv">
          <!-- <span> </span> -->

          <el-table
            class="scheduleTable"
            :data="scheduleStruct"
            :key="updateKey"
            :border="true"
            max-height="400px"
            :cell-style="setCellColor"
            header-cell-class-name="headerCell"
            v-loading="isTableLoading"
            :fit="false"
          >
            <el-table-column label="节次/周次" prop="periodColumn">
              <template #default="scope">
                <span style="display: flex; justify-content: center"
                  >第{{ scope.row.period }}节</span
                >
              </template>
            </el-table-column>

            <el-table-column
              class="courseColumn"
              min-width="150px"
              v-for="item of tableHeader"
              :label="item.name"
            >
              <template #default="scope">
                <div
                  class="cellContainer"
                  @drop="(cell) => HandleCellDrop(cell, scope)"
                  @dragover="(cell) => HandleCellDragOver(cell, scope)"
                  @dragenter="(cell) => HandleCellDragEnter(cell, scope)"
                  @dragleave="(cell) => HandleCellDragLeave(cell, scope)"
                >
                  <div
                    class="cellDiv"
                    v-for="course of scope.row.cellList[scope.column.no - 1]
                      .courseList"
                    v-show="course.isShow"
                    :style="course.style"
                    :key="course"
                    :draggable="true"
                    @dragstart="
                      (cell) =>
                        HandleTeachingClassDragStart(cell, scope, course)
                    "
                    @dragend="
                      (cell) => HandleTeachingClassDragEnd(cell, scope, course)
                    "
                    @dragover="
                      (cell) => HandleTeachingClassDragOver(cell, scope, course)
                    "
                    @dragenter="
                      (cell) => HandleTeachingClassEnter(cell, scope, course)
                    "
                    @dragleave="
                      (cell) => HandleTeachingClassLeave(cell, scope, course)
                    "
                    @drop="
                      (cell) => HandleTeachingClassDrop(cell, scope, course)
                    "
                  >
                    <span class="cellText">
                      {{ course.courseName }}<br />
                      {{ course.teacherName }}<br />
                      {{ course.weeks }}<br />
                      {{ course.periodRange }}
                    </span>
                  </div>
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
import { computed, onMounted, ref, watch, nextTick } from "vue";
import { getTeachingClassListApi } from "@/api/schedule/scheduleBuild/teachingClassList.api.js";
import { getScheduleStructApi } from "@/api/schedule/scheduleBuild/scheduleStruct.api.js";
import { getScheduleDataApi } from "@/api/schedule/scheduleBuild/scheduleData.api.js";
import { getClassTreeApi } from "@/api/schedule/scheduleBuild/classTree.api";
import { cellCreateApi } from "@/api/schedule/scheduleBuild/cellCreate.api";
import { cellMoveApi } from "@/api/schedule/scheduleBuild/cellMove.api";
import { cellDeleteApi } from "@/api/schedule/scheduleBuild/cellDelete.api";
import { cellExchangeApi } from "@/api/schedule/scheduleBuild/cellExchange.api";

import { useRoute } from "vue-router";
import aiScheduleDialogVue from "./AiScheduleDialog.vue";
import bus from "@/bus/bus";
import { ElLoading, ElMessage } from "element-plus";

export default {
  name: "ScheduleBuild",
  components: { aiScheduleDialogVue },
  setup() {
    const cellWidth = 150;
    const cellHeight = 90;

    const taskId = useRoute().query.id;

    const currentClassName = ref("");

    const currentClassId = ref("");

    const currentWeek = ref(-1);

    const classTree = ref([]); //班级tree的数据

    const firstClassId = ref("");

    const firstClassName = ref("");

    const treeKeyword = ref("");

    const treeRef = ref();

    const tableRef = ref();

    const tableHeader = [
      { name: "星期一", prop: "MonData" },
      { name: "星期二", prop: "TueData" },
      { name: "星期三", prop: "WedData" },
      { name: "星期四", prop: "ThuData" },
      { name: "星期五", prop: "FriData" },
      { name: "星期六", prop: "SatData" },
      { name: "星期日", prop: "SunData" },
    ];

    const maxWeek = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ];

    const scheduleStruct = ref([
      {
        period: 1,
        isClassBreak: false,
        isLunchBreak: false,
        isAfternoonBreak: false,
        cellList: [
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: false,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
        ],
      },
      {
        period: 2,
        isClassBreak: false,
        isLunchBreak: false,
        isAfternoonBreak: false,
        cellList: [
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: false,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
        ],
      },
      {
        period: 3,
        isClassBreak: false,
        isLunchBreak: false,
        isAfternoonBreak: false,
        cellList: [
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: false,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
        ],
      },
      {
        period: 4,
        isClassBreak: false,
        isLunchBreak: false,
        isAfternoonBreak: false,
        cellList: [
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: false,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
        ],
      },
      {
        period: 5,
        isClassBreak: false,
        isLunchBreak: false,
        isAfternoonBreak: false,
        cellList: [
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: false,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
        ],
      },
      {
        period: 6,
        isClassBreak: false,
        isLunchBreak: false,
        isAfternoonBreak: false,
        cellList: [
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: false,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
        ],
      },
      {
        period: 7,
        isClassBreak: false,
        isLunchBreak: false,
        isAfternoonBreak: false,
        cellList: [
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: false,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
        ],
      },
      {
        period: 8,
        isClassBreak: false,
        isLunchBreak: false,
        isAfternoonBreak: false,
        cellList: [
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: true,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
          {
            hasCourse: false,
            isAvailable: false,
            weeksDataList: [],
            courseList: [],
            courseNum: 0,
          },
        ],
      },
    ]);
    const scheduleStructTemp = ref([]);

    const scheduleData = ref([
      {
        cellId: "c1",
        teachingClassId: "tc1",
        teachingClassName: "高等数学（一）",
        teacherList: [
          {
            teacherId: "t1",
            teacherName: "郑秀嫦",
          },
          {
            teacherId: "t2",
            teacherName: "宋浩",
          },
        ],
        weeksData: [
          {
            courseStartWeek: 3,
            courseEndWeek: 10,
          },
        ],
        period: 1,
        cellIndex: 1,
        consecutiveClassPeriods: 2,
        type:"lab"
      },
      {
        cellId: "c2",
        teachingClassId: "tc2",
        teachingClassName: "C语言程序基础",
        teacherList: [
          {
            teacherId: "whx",
            teacherName: "王红霞",
          },
        ],
        weeksData: [
          {
            courseStartWeek: 11,
            courseEndWeek: 18,
          },
        ],
        period: 2,
        cellIndex: 2,
        consecutiveClassPeriods: 1,
      },
      {
        cellId: "c3",
        teachingClassId: "tc3",
        teachingClassName: "Java程序设计",
        teacherList: [
          {
            teacherId: "hma",
            teacherName: "黑马程序员",
          },
        ],
        weeksData: [
          {
            courseStartWeek: 3,
            courseEndWeek: 10,
          },
          {
            courseStartWeek: 11,
            courseEndWeek: 18,
          },
        ],
        period: 1,
        cellIndex: 3,
        consecutiveClassPeriods: 4,
      },
      {
        cellId: "c4",
        teachingClassId: "tc4",
        teachingClassName: "Unity3D游戏开发",
        teacherList: [
          {
            teacherId: "ltm",
            teacherName: "刘铁猛",
          },
        ],
        weeksData: [
          {
            courseStartWeek: 4,
            courseEndWeek: 12,
          },
          {
            courseStartWeek: 13,
            courseEndWeek: 18,
          },
        ],
        period: 1,
        cellIndex: 4,
        consecutiveClassPeriods: 1,
      },
    ]);
    const scheduleDataTemp = ref();

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

    const isTreeLoading = ref(false);

    const isTableLoading = ref(false);

    const updateKey = ref(0);

    onMounted(() => {
      if (taskId) {
        getClassTree().then(() => {
          currentClassName.value = firstClassName.value;
          currentClassId.value = firstClassId.value;
          getTeachingClassList(taskId, firstClassId.value);
          getScheduleStruct(taskId, firstClassId.value).then((res) => {
            if (res) {
              getScheduleData();
            }
          });
        });
      } else {
        ElMessage.error("发生错误，请回到菜单点击 开始排课 进入");
      }
    });

    //树结构过虑
    const treeFilter = (value, data) => {
      if (!value) return true;
      return data.label.includes(value);
    };

    watch(treeKeyword, (val) => {
      treeRef.value.filter(val);
    });

    const teacherNameFormatter = (teacherList) => {
      let names = "";
      teacherList.forEach((teacher) => {
        names += `#${teacher.teacherName}`;
      });
      return names;
    };

    const weeksDataFormatter = (weeksData) => {
      let weekStr = "";
      weeksData.forEach((weeks) => {
        weekStr += `${weeks.courseStartWeek}-${weeks.courseEndWeek}周;`;
      });
      return weekStr;
    };

    //周次冲突检测
    const isWeekConflict = (firstWeeks, secondWeeks) => {
      for (let i = 0; i < firstWeeks.length; i++) {
        for (let j = 0; j < secondWeeks.length; j++) {
          if (
            firstWeeks[i].courseStartWeek <= secondWeeks[j].courseEndWeek &&
            secondWeeks[j].courseStartWeek <= firstWeeks[i].courseEndWeek
          ) {
            return true;
          }
        }
      }
      return false;
    };
    //检测教学班是否与单元格内的教学班有周次冲突
    const isCellWeekConflict = (
      period,
      cellIndex,
      weeksData,
      consecutiveClassPeriods,
      whiteList
    ) => {
      //cellData:要对比的教学班
      if (period + consecutiveClassPeriods - 1 > scheduleStruct.value.length) {
        return true;
      }
      for (let i = 0; i < consecutiveClassPeriods; i++) {
        let temp;
        if (whiteList && whiteList.length > 0) {
          temp = scheduleStruct.value[period + i - 1].cellList[
            cellIndex
          ].weeksDataList.filter((weeks) => {
            return !whiteList.includes(weeks);
          });
        } else {
          temp =
            scheduleStruct.value[period + i - 1].cellList[cellIndex]
              .weeksDataList;
        }

        if (isWeekConflict(temp, weeksData)) {
          return true;
        }
      }
      return false;
    };

    //<--------------------------------下面是教学班拖拽处理---------------------------------->

    //开始拖动
    const HandleTeachingClassDragStart = (
      cell,
      { row, column, cellIndex },
      course
    ) => {
      // CurrentDragCell.value.consecutiveClassPeriods =
      //   row.cellList[column.no - 1].consecutiveClassPeriods;
      CurrentDragCellData.value.cellType = "tableCell";
      CurrentDragCellData.value.cellData =
        scheduleStruct.value[row.period - 1].cellList[column.no - 1];
      CurrentDragCellData.value.period = row.period;
      CurrentDragCellData.value.columnIndex = column.no - 1;
      CurrentDragCellData.value.courseData = course;
      CurrentDragCellData.value.isDropable = false;
      cell.target.classList.add("cellDraging");
    };

    //被拖动的教学班结束拖动
    const HandleTeachingClassDragEnd = (cell, { row, column, cellIndex }) => {
      cell.target.classList.remove("cellDraging");
      CurrentDragCellData.value = {};
    };

    //被拖动的教学班经过教学班单元格
    const HandleTeachingClassDragOver = (
      cell,
      { row, column, cellIndex },
      course
    ) => {
      if (CurrentDragCellData.value.isDropable) {
        cell.preventDefault(); //使单元格允许drop
      }
    };

    //被拖动的教学班进入教学班单元格
    const HandleTeachingClassEnter = (
      cell,
      { row, column, cellIndex },
      course
    ) => {
      let ClassPeriodsTemp; //连排节次
      if (CurrentDragCellData.value.cellType == "targetCell") {
        let cellData;
        ClassPeriodsTemp =
          CurrentDragCellData.value.cellData.consecutiveClassPeriods;
        cellData = CurrentDragCellData.value.cellData;
        if (cellData.id != course.teachingClassId) {
          //判断该教学班所在的单元格列表里的教学班是否与拖动的教学班周次冲突
          if (
            isCellWeekConflict(
              row.period,
              column.no - 1,
              cellData.weeksData,
              cellData.consecutiveClassPeriods,
              []
            )
          ) {
            if (
              isCellWeekConflict(
                row.period,
                column.no - 1,
                cellData.weeksData,
                cellData.consecutiveClassPeriods,
                course.weeksData
              )
            ) {
              cell.target.classList.add("cellHoverProhibited");
              CurrentDragCellData.value.isDropable = false;
            } else {
              if (
                !isCellWeekConflict(
                  row.period + course.consecutiveClassPeriods,
                  column.no - 1,
                  cellData.weeksData,
                  cellData.consecutiveClassPeriods -
                    course.consecutiveClassPeriods,
                  course.weeksData
                )
                //检测交换之后的位置是否有冲突
              ) {
                cell.target.classList.add("teachingClassExchangeHover");
                cell.preventDefault(); //使单元格允许drop
                CurrentDragCellData.value.isDropable = true;
              } else {
                cell.target.classList.add("cellHoverProhibited");
                CurrentDragCellData.value.isDropable = false;
              }
            }
            //周次冲突,只能交换
          } else {
            //周次不冲突,可以放入
            if (
              cell.target.className.includes("cellDiv") ||
              cell.target.className.includes("cellText")
            ) {
              CurrentDragCellData.value.isDropable = true;
              cell.target.classList.add("cellHover");
            }
          }
        }
      }

      if (CurrentDragCellData.value.cellType == "tableCell") {
        //放入的是表格中已有的教学班
        ClassPeriodsTemp =
          CurrentDragCellData.value.courseData.consecutiveClassPeriods;
        let courseData = CurrentDragCellData.value.courseData;
        let cellData = CurrentDragCellData.value.cellData;

        if (
          courseData.cellId != course.cellId &&
          courseData.teachingClassId != course.teachingClassId
        ) {
          if (
            isCellWeekConflict(
              row.period,
              column.no - 1,
              courseData.weeksData,
              courseData.consecutiveClassPeriods,
              []
            )
          ) {
            if (
              isCellWeekConflict(
                row.period,
                column.no - 1,
                courseData.weeksData,
                courseData.consecutiveClassPeriods,
                course.weeksData
              )
            ) {
              cell.target.classList.add("cellHoverProhibited");
              CurrentDragCellData.value.isDropable = false;
            } else {
              //周次冲突,只能交换
              if (
                !isCellWeekConflict(
                  row.period + course.consecutiveClassPeriods,
                  column.no - 1,
                  courseData.weeksData,
                  courseData.consecutiveClassPeriods -
                    course.consecutiveClassPeriods,
                  course.weeksData
                ) &&
                !isCellWeekConflict(
                  CurrentDragCellData.value.period +
                    courseData.consecutiveClassPeriods,
                  CurrentDragCellData.value.columnIndex,
                  course.weeksData,
                  course.consecutiveClassPeriods -
                    courseData.consecutiveClassPeriods,
                  course.weeksData
                )
                //检测交换之后的位置是否有冲突
              ) {
                cell.target.classList.add("teachingClassExchangeHover");
                CurrentDragCellData.value.isDropable = true;
              } else {
                cell.target.classList.add("cellHoverProhibited");
                CurrentDragCellData.value.isDropable = false;
              }
            }
          } else {
            //周次不冲突,可以放入
            if (
              cell.target.className.includes("cellDiv") ||
              cell.target.className.includes("cellText")
            ) {
              CurrentDragCellData.value.isDropable = true;
              cell.target.classList.add("cellHover");
            }
          }
        }
      }
    };
    //被拖动的教学班离开教学班单元格
    const HandleTeachingClassLeave = (
      cell,
      { row, column, cellIndex },
      course
    ) => {
      cell.target.classList.remove("teachingClassExchangeHover");
    };

    //被拖动的教学班被放置在教学班单元格上
    const HandleTeachingClassDrop = (
      cell,
      { row, column, cellIndex },
      course
    ) => {
      let ClassPeriodsTemp; //连排节次
      let courseData;
      let cellData;

      if (CurrentDragCellData.value.cellType == "targetCell") {
        ClassPeriodsTemp =
          CurrentDragCellData.value.cellData.consecutiveClassPeriods;
        cellData = CurrentDragCellData.value.cellData;
        if (cellData.id != course.teachingClassId) {
          if (
            isCellWeekConflict(
              row.period,
              column.no - 1,
              cellData.weeksData,
              cellData.consecutiveClassPeriods
            )
          ) {
            //周次冲突,只能交换
            HandleCellExchange(
              false,
              course.cellId,
              "",
              CurrentDragCellData.value.cellData
            );
          } else {
            //周次不冲突,合并到一个单元格里
            //create
            HandleCellCreate(
              CurrentDragCellData.value.cellData.id,
              row.period,
              column.no - 1
            );
          }
        }
      }
      if (CurrentDragCellData.value.cellType == "tableCell") {
        ClassPeriodsTemp =
          CurrentDragCellData.value.courseData.consecutiveClassPeriods;
        courseData = CurrentDragCellData.value.courseData;
        cellData = CurrentDragCellData.value.cellData;

        if (courseData.cellId != course.cellId) {
          if (
            isCellWeekConflict(
              row.period,
              column.no - 1,
              courseData.weeksData,
              courseData.consecutiveClassPeriods
            )
          ) {
            //周次冲突,只能交换
            HandleCellExchange(
              true,
              course.cellId,
              CurrentDragCellData.value.courseData.cellId,
              ""
            );
          } else {
            //周次不冲突,合并到一个单元格里
            HandleCellMove(
              courseData.cellId,
              row.period,
              column.no - 1,
              cellData.period,
              cellData.cellIndex
            );
          }
        }
      }

      cell.target.classList.remove("teachingClassExchangeHover");
      cell.target.classList.remove("cellHover");
    };

    //<--------------------------------下面是表格单元格拖拽处理---------------------------------->

    //根据单元格状态改变背景
    const setCellColor = ({ row, column, rowIndex, columnIndex }) => {
      if (columnIndex > 0 && columnIndex < 8) {
        if (row.cellList[columnIndex - 1].isAvailable) {
          return {
            padding: "0px",
            height: `${cellHeight}px`,
            width: `${cellWidth}px`,
          };
        } else {
          return {
            background: "#DCDFE6",
            padding: "0px",
            height: `${cellHeight}px`,
            width: `${cellWidth}px`,
          };
        }
      }
    };

    //被拖动的教学班经过单元格
    const HandleCellDragOver = (cell, { row, column, cellIndex }) => {
      //被拖动的单元格经过
      if (cell.target.className.includes("cellContainer")) {
        let ClassPeriodsTemp; //连排节次
        let courseData;
        let cellData;
        if (CurrentDragCellData.value.cellType == "targetCell") {
          ClassPeriodsTemp =
            CurrentDragCellData.value.cellData.consecutiveClassPeriods;
          cellData = CurrentDragCellData.value.cellData;

          if (CurrentDragCellData.value.cellData) {
            //检查被拖动的单元格是否是自己
            if (
              !row.cellList[column.no - 1].courseList.includes(
                CurrentDragCellData.value.cellData.courseId
              )
            ) {
              if (
                isCellWeekConflict(
                  row.period,
                  column.no - 1,
                  cellData.weeksData,
                  cellData.consecutiveClassPeriods
                )
              ) {
                //周次冲突
                cell.target.classList.add("cellHoverProhibited");
              } else {
                //周次不冲突
                if (ClassPeriodsTemp == 1) {
                  if (row.cellList[column.no - 1].isAvailable) {
                    cell.preventDefault(); //使单元格允许drop
                    cell.target.classList.add("cellHover"); //如果当前单元格没有课程且可用改变背景
                  }
                } else {
                  if (
                    row.period <
                    scheduleStruct.value.length - ClassPeriodsTemp + 2
                  ) {
                    let counter = 0;
                    for (let p = 0; p < ClassPeriodsTemp; p++) {
                      if (p == 0) {
                        if (row.cellList[column.no - 1].isAvailable) {
                          counter++;
                          continue;
                        }
                      } else {
                        if (
                          scheduleStruct.value[row.period + p - 1].cellList[
                            column.no - 1
                          ].isAvailable
                        ) {
                          counter++;
                          continue;
                        }
                      }
                    }

                    if (counter == ClassPeriodsTemp) {
                      cell.preventDefault(); //使单元格允许drop
                      cell.target.classList.add("cellHover");

                      //根据连排节次改变下面的单元格样式
                      let currentRow = cell.target.closest("tr");
                      for (let p = 1; p < ClassPeriodsTemp; p++) {
                        if (currentRow) {
                          if (currentRow.nextElementSibling) {
                            currentRow.nextElementSibling.cells[
                              column.no
                            ].classList.add("cellHover");
                          }
                          currentRow = currentRow.nextElementSibling;
                        }
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
            }
          }
        }
        if (CurrentDragCellData.value.cellType == "tableCell") {
          ClassPeriodsTemp =
            CurrentDragCellData.value.courseData.consecutiveClassPeriods;
          courseData = CurrentDragCellData.value.courseData;

          if (CurrentDragCellData.value.cellData) {
            //检查被拖动的单元格是否是自己
            if (
              !row.cellList[column.no - 1].courseList.includes(
                CurrentDragCellData.value.cellData.courseId
              )
            ) {
              if (
                isCellWeekConflict(
                  row.period,
                  column.no - 1,
                  courseData.weeksData,
                  courseData.consecutiveClassPeriods
                )
              ) {
                //周次冲突
                cell.target.classList.add("cellHoverProhibited");
              } else {
                //周次不冲突
                if (ClassPeriodsTemp == 1) {
                  if (row.cellList[column.no - 1].isAvailable) {
                    cell.preventDefault(); //使单元格允许drop
                    cell.target.classList.add("cellHover"); //如果当前单元格没有课程且可用改变背景
                  }
                } else {
                  if (
                    row.period <
                    scheduleStruct.value.length - ClassPeriodsTemp + 2
                  ) {
                    let counter = 0;
                    for (let p = 0; p < ClassPeriodsTemp; p++) {
                      if (p == 0) {
                        if (row.cellList[column.no - 1].isAvailable) {
                          counter++;
                          continue;
                        }
                      } else {
                        if (
                          scheduleStruct.value[row.period + p - 1].cellList[
                            column.no - 1
                          ].isAvailable
                        ) {
                          counter++;
                          continue;
                        }
                      }
                    }

                    if (counter == ClassPeriodsTemp) {
                      cell.preventDefault(); //使单元格允许drop
                      cell.target.classList.add("cellHover");

                      //根据连排节次改变下面的单元格样式
                      let currentRow = cell.target.closest("tr");
                      for (let p = 1; p < ClassPeriodsTemp; p++) {
                        if (currentRow) {
                          if (currentRow.nextElementSibling) {
                            currentRow.nextElementSibling.cells[
                              column.no
                            ].classList.add("cellHover");
                          }
                          currentRow = currentRow.nextElementSibling;
                        }
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
            }
          }
        }
      }
    };

    const HandleCellDragEnter = (cell, { row, column, cellIndex }) => {};

    //被拖动的教学班离开单元格
    const HandleCellDragLeave = (cell, { row, column, cellIndex }) => {
      //被拖动的单元格离开
      cell.target.classList.remove("cellHover");
      cell.target.classList.remove("cellHoverProhibited");
      let ClassPeriodsTemp; //连排节次
      if (CurrentDragCellData.value.cellType == "targetCell") {
        ClassPeriodsTemp =
          CurrentDragCellData.value.cellData.consecutiveClassPeriods;
      }
      if (CurrentDragCellData.value.cellType == "tableCell") {
        ClassPeriodsTemp =
          CurrentDragCellData.value.courseData.consecutiveClassPeriods;
      }

      //根据连排节次改变下面的单元格样式
      let currentRow = cell.target.closest("tr");
      for (let p = 1; p < ClassPeriodsTemp; p++) {
        if (currentRow) {
          if (currentRow.nextElementSibling) {
            currentRow.nextElementSibling.cells[column.no].classList.remove(
              "cellHover"
            );
          }
          currentRow = currentRow.nextElementSibling;
        }
      }
    };

    //被拖动的教学班被放置在单元格上
    const HandleCellDrop = (cell, { row, column, cellIndex }) => {
      //单元格被放下
      // //获取被拖动单元格的数据
      if (cell.target.className.includes("cellContainer")) {
        let cellType = CurrentDragCellData.value.cellType;

        if (cellType === "tableCell") {
          let periodTemp = CurrentDragCellData.value.period;
          let columnIndexTemp = CurrentDragCellData.value.columnIndex;
          let courseIndexTemp =
            CurrentDragCellData.value.courseData.courseIndex;
          let cellId = CurrentDragCellData.value.courseData.cellId;
          let ClassPeriodsTemp =
            CurrentDragCellData.value.courseData.consecutiveClassPeriods; //连排节次

          //根据连排节次改变下面的单元格样式
          let currentRow = cell.target.closest("tr");
          for (let p = 1; p < ClassPeriodsTemp; p++) {
            if (currentRow) {
              if (currentRow.nextElementSibling) {
                currentRow.nextElementSibling.cells[column.no].classList.remove(
                  "cellHover"
                );
              }
              currentRow = currentRow.nextElementSibling;
            }
          }
          //验证周次是否冲突后添加课程
          HandleCellMove(
            cellId,
            row.period,
            column.no - 1,
            periodTemp,
            columnIndexTemp
          );
        }
        if (cellType === "targetCell") {
          let teachingClassIdTemp = CurrentDragCellData.value.cellData.id;
          let ClassPeriodsTemp =
            CurrentDragCellData.value.cellData.consecutiveClassPeriods;
          let currentRow = cell.target.closest("tr");
          for (let p = 1; p < ClassPeriodsTemp; p++) {
            if (currentRow) {
              if (currentRow.nextElementSibling) {
                currentRow.nextElementSibling.cells[column.no].classList.remove(
                  "cellHover"
                );
              }
              currentRow = currentRow.nextElementSibling;
            }
          }
          HandleCellCreate(teachingClassIdTemp, row.period, column.no - 1);
          // cellClear(periodTemp, columnIndexTemp, false);
        }
      }
      cell.target.classList.remove("cellHover");
      cell.target.classList.remove("teachingClassExchangeHover");
    };

    //<--------------------------------下面是教学班列表拖拽处理---------------------------------->

    const HandleTargetCellDragStart = (cell, data) => {
      CurrentDragCellData.value = { cellType: "targetCell", cellData: data };
      CurrentDragCellData.value.isDropable = false;
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
        let cellId = CurrentDragCellData.value.courseData.cellId;
        HandleCellDelete(cellId);
      }
      cell.target.classList.remove("cellHover");
    };

    const HandleTreeNodeClick = (node) => {
      if (node.select) {
        currentClassName.value = node.label;
        currentClassId.value = node.id;
        scheduleStruct.value = [];
        scheduleDataTemp.value = [];
        scheduleData.value = [];
        currentWeek.value = -1;
        scheduleStructTemp.value = "";
        getTeachingClassList(taskId, node.id);
        getScheduleStruct(taskId, node.id).then((res) => {
          if (res) {
            getScheduleData();
          }
        });
      }
    };

    // const setListRowspan = (List) => {
    //   List.forEach((item) => {
    //     for (let i = 0; i < item.cellList.length; i++) {
    //       item.cellList[i].rowspan = 1;
    //     }
    //   });
    //   for (let i = 0; i < List.length; i++) {
    //     let cellIndexTemp = 1;
    //     for (let j = 0; j < List[i].cellList.length; j++) {
    //       if (List[i].cellList[j].consecutiveClassPeriods == 1) {
    //         List[i].cellList[j].rowspan = 1;
    //         List[i].cellList[j].cellIndex = cellIndexTemp;
    //         cellIndexTemp++;
    //       } else {
    //         if (List[i].cellList[j].rowspan != 0) {
    //           List[i].cellList[j].rowspan =
    //             List[i].cellList[j].consecutiveClassPeriods;
    //           List[i].cellList[j].cellIndex = null;
    //           cellIndexTemp++;
    //         }
    //         if (i < List.length - 1) {
    //           for (let k = i + 1; k < i + List[i].cellList[j].rowspan; k++) {
    //             List[k].cellList[j].rowspan = 0;
    //             List[k].cellList[j].consecutiveClassPeriods = 0;
    //             List[k].cellList[j].cellIndex = cellIndexTemp;
    //           }
    //         }
    //       }
    //       // List[i].rowspan=List[i].consecutiveClassPeriods;
    //       // List[j].rowspan--;
    //     }
    //     // i = i + List[i].rowspan - 1;
    //   }
    //   return List;
    // };

    //在连堂课时合并单元格
    // const tableSpan = ({ row, column, rowIndex, columnIndex }) => {
    //   if (columnIndex != 0) {
    //     if (
    //       scheduleStruct.value[rowIndex].cellList[columnIndex - 1].rowspan <= 0
    //     ) {
    //       return [0, 0];
    //     } else {
    //       return [
    //         scheduleStruct.value[rowIndex].cellList[columnIndex - 1].rowspan,
    //         1,
    //       ];
    //     }
    //   } else {
    //     return [1, 1];
    //   }
    // };

    watch(scheduleStruct, () => {
      console.log("up!");
    });

    const updateScheduleStruct = () => {
      scheduleStruct.value = JSON.parse(scheduleStructTemp.value);
      if (scheduleData.value.length > 0) {
        scheduleData.value.forEach((cell) => {
          //遍历教学班数组
          if (scheduleStruct.value[cell.period - 1].cellList[cell.cellIndex]) {
            if (
              scheduleStruct.value[cell.period - 1].cellList[cell.cellIndex]
                .isAvailable
            ) {
              let teacherName = "";
              cell.teacherList.forEach((teacher) => {
                teacherName += `#${teacher.teacherName}`;
              });

              let weeks = "";

              cell.weeksData.forEach((time) => {
                // scheduleStruct.value[cell.period - 1].cellList[
                //   cell.cellIndex
                // ].weeksDataList.push(time);
                weeks += `${time.courseStartWeek}-${time.courseEndWeek}周;`;
              });

              let periodRange = "";

              if (cell.consecutiveClassPeriods == 1) {
                periodRange = `第${cell.period}节`;
              } else {
                periodRange = `第${cell.period}节-第${
                  cell.period + cell.consecutiveClassPeriods - 1
                }节`;
              }

              let isShow = true;
              if (currentWeek.value != -1) {
                if (
                  !isWeekConflict(
                    [
                      {
                        courseStartWeek: currentWeek.value,
                        courseEndWeek: currentWeek.value,
                      },
                    ],
                    cell.weeksData
                  )
                ) {
                  isShow = false;
                }
              }

              let backgroundcolor
              switch (cell.type) {
                case "lab":
                  backgroundcolor = "rgb(148.6, 212.3, 117.1)"; //绿色
                  break
                case "seminar":
                  backgroundcolor = "#ffca77"; //橙色
                  break
                case "exam":
                  backgroundcolor = "#ff9f9f";
                  break
                default:
                  backgroundcolor = "rgb(159.5, 206.5, 255)";
              }

              //更新scheduleStruct
              scheduleStruct.value[cell.period - 1].cellList[
                cell.cellIndex
              ].courseList.push({
                cellId: cell.cellId,
                teachingClassId: cell.teachingClassId,
                courseName: cell.teachingClassName,
                teacherName,
                weeks,
                weeksData: cell.weeksData,
                consecutiveClassPeriods: cell.consecutiveClassPeriods,
                periodRange,
                style: {
                  height: `${cellHeight * cell.consecutiveClassPeriods}px`,
                  background:backgroundcolor
                },
                isShow,
              });

              //为每个单元格添加周次信息
              for (let i = 0; i < cell.consecutiveClassPeriods; i++) {
                scheduleStruct.value[cell.period + i - 1].cellList[
                  cell.cellIndex
                ].weeksDataList = [
                  ...scheduleStruct.value[cell.period + i - 1].cellList[
                    cell.cellIndex
                  ].weeksDataList,
                  ...cell.weeksData,
                ];
              }
              if (isShow) {
                for (let i = 0; i < cell.consecutiveClassPeriods; i++) {
                  scheduleStruct.value[cell.period + i - 1].cellList[
                    cell.cellIndex
                  ].courseNum++;
                }
              }

              //添加宽度样式
              scheduleStruct.value[cell.period - 1].cellList[
                cell.cellIndex
              ].courseList.sort(
                (a, b) => a.consecutiveClassPeriods - b.consecutiveClassPeriods
              );

              scheduleStruct.value[cell.period - 1].cellList[
                cell.cellIndex
              ].courseList.forEach((course) => {
                course.style.width = `${
                  cellWidth /
                  scheduleStruct.value[cell.period - 1].cellList[cell.cellIndex]
                    .courseNum
                }px`;
              });
            } else {
              ElMessage.error(
                `${cell.teachingClassName} 与排课设置冲突! 请修改排课设置后重试！`
              );
            }
          }
        });
        // scheduleStruct.value = setListRowspan(scheduleStruct.value);
        // updateKey.value += 1;
      }
    };

    const setRowClass = ({ row, rowIndex }) => {
      if (row.isClassBreak) {
        return "classBreakBorder";
      }
      if (row.isLunchBreak) {
        return "lunchBreakBorder";
      }
      if (row.isAfternoonBreak) {
        return "afternoonBreakBorder";
      }
      return "";
    };

    //====================================单元格动态高度===================================

    const HandleTeachingClassCellStyle = () => {
      return { background: "#000" };
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
    const getScheduleStruct = (taskId, classId) => {
      isTableLoading.value = true;
      return getScheduleStructApi(taskId, classId)
        .then((res) => {
          if (res) {
            if (res.meta.code == 200) {
              // scheduleStruct.value = res.data
              scheduleStructTemp.value = JSON.stringify(scheduleStruct.value);
              isTableLoading.value = false;
              return true;
            }
          }
        })
        .finally(() => {
          isTableLoading.value = false;
        });
    };

    const getScheduleData = () => {
      isTableLoading.value = true;
      getScheduleDataApi(taskId, currentClassId.value)
        .then((res) => {
          if (res) {
            if (res.meta.code == 200) {
              isTableLoading.value = false;
              // scheduleData.value = res.data;
              scheduleDataTemp.value = JSON.stringify(scheduleData.value);
            }
          }
        })
        .then((res) => {
          updateScheduleStruct(res);
        });
    };

    const getClassTree = () => {
      isTreeLoading.value = true;
      return getClassTreeApi(taskId).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            classTree.value = res.data.tree;
            firstClassId.value = res.data.firstClassId;
            firstClassName.value = res.data.firstClassName;
            isTreeLoading.value = false;
          }
        }
      });
    };

    const HandleCellMove = (
      cellId,
      newPeriod,
      newCellIndex,
      oldPeriod,
      oldCellIndex
    ) => {
      console.log("move!");

      //这里是手动改变scheduleData,之后要删掉
      scheduleData.value.forEach((course) => {
        if (course.cellId == cellId) {
          scheduleData.value[scheduleData.value.indexOf(course)].period =
            newPeriod;
          scheduleData.value[scheduleData.value.indexOf(course)].cellIndex =
            newCellIndex;
        }
      });
      //----------------------------------
      cellMoveApi(
        taskId,
        currentClassId.value,
        cellId,
        { oldPeriod, oldCellIndex },
        { newPeriod, newCellIndex }
      ).then((res) => {
        if (res) {
          if (res.meta.code === 200) {
            console.log(res);

            getScheduleData();
          }
        }
      });
    };

    const HandleCellExchange = (
      isTableCell,
      firstCellId,
      secondCellId,
      exchangeCellData
    ) => {
      console.log("exchange!");
      //这里是手动改变scheduleData,之后要删掉
      if (isTableCell) {
        let temp;
        let firstCell =
          scheduleData.value[
            scheduleData.value.findIndex(
              (course) => course.cellId == firstCellId
            )
          ];
        let secondCell =
          scheduleData.value[
            scheduleData.value.findIndex(
              (course) => course.cellId == secondCellId
            )
          ];

        temp = secondCell.period;
        secondCell.period = firstCell.period;
        firstCell.period = temp;

        temp = secondCell.cellIndex;
        secondCell.cellIndex = firstCell.cellIndex;
        firstCell.cellIndex = temp;
      } else {
        //targetCell
        let temp;
        let firstCell =
          scheduleData.value[
            scheduleData.value.findIndex(
              (course) => course.cellId == firstCellId
            )
          ];

        firstCell.consecutiveClassPeriods =
          exchangeCellData.consecutiveClassPeriods;
        firstCell.weeksData = exchangeCellData.weeksData;
        firstCell.teacherList = exchangeCellData.teacherList;
        firstCell.teachingClassId = exchangeCellData.id;
        firstCell.teachingClassName = exchangeCellData.courseName;
      }
      //----------------------------------
      cellExchangeApi(
        taskId,
        currentClassId.value,
        isTableCell,
        firstCellId,
        secondCellId,
        exchangeCellData
      ).then((res) => {
        if (res) {
          if (res.meta.code === 200) {
            console.log(res);
            getClassTree();
            getScheduleData();
          }
        }
      });
    };

    const HandleCellCreate = (teachingClassId, period, cellIndex) => {
      console.log("create!");
      //这里是手动改变scheduleData,之后要删掉
      scheduleData.value.push({
        cellId: Math.random(),
        teachingClassId,
        teachingClassName: CurrentDragCellData.value.cellData.courseName,
        teacherList: CurrentDragCellData.value.cellData.teacherList,
        weeksData: CurrentDragCellData.value.cellData.weeksData,
        period,
        cellIndex,
        consecutiveClassPeriods:
          CurrentDragCellData.value.cellData.consecutiveClassPeriods,
      });
      //--------------------------------
      cellCreateApi(
        taskId,
        currentClassId.value,
        teachingClassId,
        period,
        cellIndex
      ).then((res) => {
        if (res) {
          if (res.meta.code === 200) {
            getClassTree();
            getScheduleData();
          }
        }
      });
    };

    const HandleCellDelete = (cellId) => {
      console.log("delete!");
      //这里是手动改变scheduleData,之后要删掉
      scheduleData.value = scheduleData.value.filter((course) => {
        return course.cellId != cellId;
      });
      //--------------------------------------------------------------
      cellDeleteApi(taskId, currentClassId.value, cellId).then((res) => {
        if (res) {
          if (res.meta.code === 200) {
            getClassTree();
            getScheduleData();
          }
        }
      });
    };

    const HandleAiClick = () => {
      bus.emit("showAiScheduleDialog",{taskId,currentClassId,currentClassName},);
    };

    const HandleWeekSelect = () => {
      updateScheduleStruct();
    };

    return {
      classTree,
      treeFilter,
      treeRef,
      scheduleStruct,
      scheduleStructTemp,
      scheduleData,
      tableHeader,
      setCellColor,
      teacherNameFormatter,
      weeksDataFormatter,

      HandleCellDrop,
      HandleCellDragOver,
      HandleCellDragLeave,
      HandleCellDragEnter,

      HandleTargetCellDragStart,
      HandleTargetCellDragEnd,
      HandleTargetCellDrop,
      HandleTargetCellDragOver,
      HandleListDragOver,

      HandleTeachingClassDragStart,
      HandleTeachingClassDragEnd,
      HandleTeachingClassDragOver,
      HandleTeachingClassEnter,
      HandleTeachingClassLeave,
      HandleTeachingClassDrop,

      teachingClassList,

      HandleTreeNodeClick,

      getTeachingClassList,

      currentClassName,
      getScheduleStruct,
      finishedTeachingClassNum,
      totalTeachingClassNum,

      HandleAiClick,
      CurrentDragCellData,
      treeKeyword,
      isTreeLoading,
      isTableLoading,

      HandleCellMove,
      HandleCellCreate,
      HandleCellDelete,
      updateKey,
      tableRef,
      setRowClass,
      HandleTeachingClassCellStyle,
      maxWeek,
      currentWeek,
      HandleWeekSelect,
    };
  },
};
</script>

<style >
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
  height: 20px;
  margin-bottom: 10px;
}

.workPart {
  height: auto;
  width: auto;
  display: flex;
  justify-content: space-between;
  padding: 10px;
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
  height: max-content;
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
  width: 100%;
  height: 100%;
  background: rgb(159.5, 206.5, 255);
  border: solid 1px #dcdfe6;
  box-sizing: border-box;
  z-index: 999;
  display: flex;
  position: relative;
  left: 0px;
  cursor: move;
}

.cellContainer {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
  z-index: 10;
  position: absolute;
  overflow: visible;
}

.cell:has(.cellDiv) {
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0px;
  line-height: 15px;
  z-index: -1;
}
.cell:has(.cellContainer) {
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0px;
  line-height: 15px;
  z-index: -1;
}
.cellText {
  font-size: 10px;
  height: 100%;
  width: 100%;
  line-height: 20px;
  text-align: left;
  align-content: flex-start;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: white;
  z-index: 1000;
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
  background: #ff4d5f !important;
}
.teachingClassExchangeHover {
  background: #7dff7b !important;
}

.cellDraging {
  opacity: 0.4;
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
  width: max-content;
  min-width: 150px;
  margin: 5px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
  cursor: move;
}
.cellOptionDiv:hover {
  width: max-content;
  min-width: 150px;
  margin: 5px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  border: solid 1px rgb(197.7, 225.9, 255);
  background: rgb(235.9, 245.3, 255);
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

.classBreakBorder {
  border: solid 1px red;
}
.lunchBreakBorder {
  border: solid 1px blue;
}
.afternoonBreakBorder {
  border: solid 1px green;
}

.scheduleTable.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: initial;
}

.weekSelect {
  width: 250px;
}

.headerCell {
  height: 30px;
  padding: 0px !important;
}

::v-deep .el-table td::after {
  z-index: -1; /* 根据实际情况调整 */
}
</style>