<template>
  <div class="scheduleViewerBody">
    <div class="filterContianer">
      <div class="filterItem">
        <el-text class="filterTitle">院系:</el-text>
        <el-select
          class="filterSelect"
          v-model="facultyKeyword"
          size="small"
          remote
          filterable
          :remote-method="searchFaculty"
          :loading="isFacultyLoading"
          @change="HandleFacultyChange"
          @visible-change="facultyDropDownVisable"
          :empty-values="[null]"
          :value-on-clear="null"
          ref="facultySelectRef"
        >
          <el-option
            v-for="option of faculty"
            :label="option.name"
            :value="option.id"
            :key="option.id"
          />
        </el-select>
      </div>
      <div class="filterItem">
        <el-text class="filterTitle">专业:</el-text>
        <el-select
          size="small"
          class="filterSelect"
          v-model="majorKeyword"
          filterable
          remote
          :remote-method="
            (keyword) => {
              searchMajor(keyword, true);
            }
          "
          :loading="isMajorLoading"
          @visible-change="majorDropDownVisable"
          ref="majorSelectRef"
          :empty-values="[null]"
          :value-on-clear="null"
        >
          <div
            v-infinite-scroll="
              () => {
                searchMajor(undefined, false);
              }
            "
            :infinite-scroll-delay="800"
            :infinite-scroll-immediate="false"
            style="overflow: hide"
          >
            <el-option
              v-for="option of major"
              :label="option.name"
              :value="option.id"
              :key="option.id"
            />
            <el-option label="加载中..." v-show="!isMajorLoading" disabled />
          </div>
        </el-select>
      </div>
      <div class="filterItem">
        <el-text class="filterTitle">年级:</el-text>
        <el-select
          size="small"
          class="filterSelect"
          v-model="gradeKeyword"
          @visible-change="gradeDropDownVisable"
          ref="gradeSelectRef"
        >
          <el-scrollbar height="400px">
            <el-option
              v-for="option of grade"
              :label="option.name"
              :value="option.id"
              :key="id"
            />
          </el-scrollbar>
        </el-select>
      </div>
    </div>

    <div class="mainContainer">
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
          v-loading="isClassTreeLoading"
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
            highlight-current
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
      <div class="scheduleViewerContainer">
        <el-button class="exportButton" type="primary" size="small"
          >导出</el-button
        >
        <div class="scheduleContainer">
          <div class="scheduleTableDiv">
            <!-- <span> </span> -->

            <el-table
              class="scheduleTable"
              :data="scheduleStruct"
              :key="updateKey"
              :border="true"
              max-height="390px"
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
                min-width="150px"
                v-for="item of tableHeader"
                :label="item.name"
              >
                <template #default="scope">
                  <div class="cellContainer">
                    <div
                      class="cellDiv"
                      v-for="course of scope.row.cellList[scope.column.no - 1]
                        .courseList"
                      v-show="course.isShow"
                      :style="course.style"
                      :key="course"
                    >
                      <span class="cellText">
                        <span>{{ course.courseName }}</span
                        ><br />
                        <span>{{ course.teacherName }}</span
                        ><br />
                        <span>{{ course.weeks }}</span
                        ><br />
                        <span>{{ course.periodRange }}</span>
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
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, watch, toRefs } from "vue";
import { Search } from "@element-plus/icons-vue";
import FullCalendar from "@fullcalendar/vue3";
import { getClassListApi } from "@/api/schedule/addClass/classList.api.js";
import { useRoute } from "vue-router";
import router from "@/router";
import { getMajorListApi } from "@/api/basicData/major.api";
import { getAllDepartmentApi } from "@/api/basicData/departments.api";
import { getScheduleDataApi } from "@/api/schedule/scheduleBuild/scheduleData.api";
import { getScheduleStructApi } from "@/api/schedule/scheduleBuild/scheduleStruct.api";

export default {
  name: "scheduleViewer",
  setup() {
    const cellWidth = 130;
    const cellHeight = 70;

    const taskId = useRoute().query.id;

    const majorPageInfo = reactive({
      page: 1,
      size: 10,
      total: -1,
    });

    const tableHeader = [
      { name: "星期一", prop: "MonData" },
      { name: "星期二", prop: "TueData" },
      { name: "星期三", prop: "WedData" },
      { name: "星期四", prop: "ThuData" },
      { name: "星期五", prop: "FriData" },
      { name: "星期六", prop: "SatData" },
      { name: "星期日", prop: "SunData" },
    ];

    const currentWeek = ref(-1);

    const currentScheduleData = ref([]);
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
    const scheduleStructTemp = ref();
    const isClassTreeLoading = ref(false);
    const isFacultyLoading = ref(false);
    const isMajorLoading = ref(false);

    const majorSelectRef = ref();
    const facultySelectRef = ref();
    const gradeSelectRef = ref();

    const filterKeywords = reactive({
      facultyKeyword: "",
      majorKeyword: "",
      majorKeywordTemp: "",
      gradeKeyword: "",
    });

    const filterOptions = reactive({
      faculty: [
        {
          id: "",
          name: "全部",
        },
      ],
      major: [
        {
          id: "",
          name: "全部",
        },
      ],
      grade: [
        {
          id: "*",
          name: "全部",
        },
        {
          id: "19",
          name: "2019级",
        },
        {
          id: "20",
          name: "2020级",
        },
        {
          id: "21",
          name: "2021级",
        },
        {
          id: "22",
          name: "2022级",
        },
        {
          id: "23",
          name: "2023级",
        },
        {
          id: "24",
          name: "2024级",
        },
      ],
    });

    const loadClassList = () => {
      console.log("已经到底了~");
    };

    const classTree = ref([
      {
        id: "rgzb241",
        label: "24软件工程中本一体化",
        campus: "南浔校区",
        facultyId: "jsj",
        majorId: "rgzb",
        isFixedClassRoom: false,
      },
      {
        id: "rgzb231",
        label: "23软件工程中本一体化",
      },
      {
        id: "rgzb221",
        label: "22软件工程中本一体化",
      },
      {
        id: "jsjwl",
        label: "计算机网络",
      },
      {
        id: "21wlzb",
        label: "21物联网技术应用中本一体化",
      },
    ]);

    const treeKeyword = ref("");

    //树结构过虑
    const treeFilter = (value, data) => {
      if (!value) return true;
      return data.label.includes(value);
    };

    const currentClass = ref({});

    onMounted(() => {
      searchMajor();
      scheduleStructTemp.value = JSON.stringify(scheduleStruct.value);
    });

    const HandleTreeNodeClick = (node) => {
      if (!scheduleStruct.value.length) {
        getScheduleStruct().then((res) => {
          if (res === 200) {
            getScheduleData(node.id);
            scheduleStructTemp.value = JSON.stringify(scheduleStruct.value);
          }
        });
      } else {
        getScheduleData(node.id);
      }
    };

    const getScheduleData = (classId) => {
      getScheduleDataApi(taskId, classId)
        .then((res) => {
          if (res) {
            if (res.meta.code === 200) {
              currentScheduleData.value = res.data;
            }
          }
        })
        .then(() => {
          updateScheduleStruct();
        });
    };

    const getScheduleStruct = () => {
      return getScheduleStructApi(taskId).then((res) => {
        if (res) {
          console.log(res);
          if (res.meta.code === 200) {
            scheduleStruct.value = res.data;
            console.log(res.data);
            scheduleStructTemp.value = JSON.stringify(res.data);
            return 200;
          }
        }
      });
    };

    const HandleFacultyChange = () => {};

    const searchFaculty = () => {
      isFacultyLoading.value = true;
      getAllDepartmentApi()
        .then((res) => {
          if (res) {
            if (res.code === 200) {
              filterOptions.faculty = [{ id: "", name: "全部" }, ...res.data];
            }
          }
        })
        .finally(() => {
          isFacultyLoading.value = false;
        });
    };

    const searchMajor = (keyword, isKeywordChange) => {
      if (isKeywordChange) {
        filterKeywords.majorKeywordTemp = keyword;
        majorPageInfo.page = 1;
        majorPageInfo.size = 10;
        majorPageInfo.total = -1;
        filterOptions.major = [
          {
            id: "*",
            name: "全部",
          },
        ];
      }
      console.log(filterKeywords.majorKeywordTemp);
      if (majorPageInfo.total === -1) {
        isMajorLoading.value = true;
        getMajorListApi({
          page: majorPageInfo.page,
          size: majorPageInfo.size,
          keyword: filterKeywords.majorKeywordTemp,
          faculty: filterKeywords.facultyKeyword,
        })
          .then((res) => {
            if (res) {
              if (res.meta.code === 200) {
                filterOptions.major = [
                  ...filterOptions.major,
                  ...res.data.majors,
                ];
                majorPageInfo.total = res.data.total;
              }
            }
          })
          .finally(() => {
            isMajorLoading.value = false;
          });
      } else {
        majorPageInfo.page++;
        if (majorPageInfo.page * majorPageInfo.size < majorPageInfo.total) {
          isMajorLoading.value = true;
          getMajorListApi({
            page: majorPageInfo.page,
            size: majorPageInfo.size,
            keyword: filterKeywords.majorKeywordTemp,
            faculty: filterKeywords.facultyKeyword,
          })
            .then((res) => {
              if (res) {
                if (res.meta.code === 200) {
                  filterOptions.major = [
                    ...filterOptions.major,
                    ...res.data.majors,
                  ];
                  majorPageInfo.total = res.data.total;
                }
              }
            })
            .finally(() => {
              isMajorLoading.value = false;
            });
        }
      }
    };

    const searchGrade = (keyword) => {
      isMajorLoading.value = true;
      setTimeout(() => {
        let major = [
          {
            id: "rgzb",
            name: "软件工程（中本）",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
          {
            id: "wlwjsyy",
            name: " 物联网技术应用",
          },
        ];
        filterOptions.major = [
          {
            id: "*",
            name: "全部",
          },
          ...major,
        ];
        isMajorLoading.value = false;
      }, 500);
    };

    const majorDropDownVisable = () => {
      majorSelectRef.value.scrollbarRef.scrollTo(0, 0);
    };
    const gradeDropDownVisable = () => {
      gradeSelectRef.value.scrollbarRef.scrollTo(0, 0);
    };
    const faciltyDropDownVisable = () => {
      facultySelectRef.value.scrollbarRef.scrollTo(0, 0);
    };
    //=======api=========================

    const getFaculty = () => {};

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

    const updateScheduleStruct = () => {
      scheduleStruct.value = JSON.parse(scheduleStructTemp.value);
      if (currentScheduleData.value.length > 0) {
        currentScheduleData.value.forEach((cell) => {
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

              let backgroundcolor;
              switch (cell.type) {
                case "lab":
                  backgroundcolor = "rgb(148.6, 212.3, 117.1)"; //绿色
                  break;
                case "seminar":
                  backgroundcolor = "#ffca77"; //橙色
                  break;
                case "exam":
                  backgroundcolor = "#ff9f9f";
                  break;
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
                  background: backgroundcolor,
                },
                isShow,
              });

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
    return {
      ...toRefs(filterOptions),
      ...toRefs(filterKeywords),
      treeFilter,
      HandleTreeNodeClick,
      searchFaculty,
      searchMajor,
      searchGrade,
      classTree,
      treeKeyword,
      isClassTreeLoading,
      loadClassList,
      isFacultyLoading,
      isMajorLoading,
      HandleFacultyChange,
      majorPageInfo,
      majorSelectRef,
      facultySelectRef,
      gradeSelectRef,
      majorDropDownVisable,
      gradeDropDownVisable,
      faciltyDropDownVisable,
      currentScheduleData,
      scheduleStruct,
      tableHeader,
      setCellColor,
    };
  },
};
</script>

<style scoped>
.scheduleViewerBody {
  height: 520px;
  display: flex;
  margin: 10px 0px 0px 0px;
  flex-direction: column;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.filterContianer {
  width: auto;
  height: 40px;
  margin: 10px 10px 0px 10px;
  display: flex;
  align-content: center;
  overflow: hidden;
}

.filterItem {
  width: max-content;
  margin: 0px 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.filterTitle {
  font-size: 16px;
  white-space: nowrap;
}

.filterSelect {
  width: 250px;
  margin: auto 10px;
}

.divider {
  margin: 5px 2px;
}

.searchButton {
  width: 100px;
  margin: 10px 20px;
}

.mainContainer {
  width: auto;
  display: inline-flex;
  margin: 10px;
  flex-direction: row;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.clssListContainer {
  width: 20%;
  display: inline-flex;
  margin: 10px;
  flex-direction: column;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.scheduleViewerContainer {
  width: 80%;
  height: 440px;
  display: inline-flex;
  margin: 10px;
  flex-direction: column;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
}

.classTreeDiv {
  width: 20%;
  display: inline-flex;
  flex-direction: column;
  justify-content: left;
  margin: 10px 0px 10px 10px;
  padding: 10px;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.classTreeTitle {
  margin: 3px 0px;
  font-size: 16px;
  font-weight: bold;
  justify-self: left;
}

.exportButton {
  width: 80px;
  margin: 10px 10px 0px 10px;
}

.scheduleContainer {
  width: auto;
  margin: 10px;
  display: inline-flex;
  background: white;
}

:deep(.scheduleTable.el-table--enable-row-hover .el-table__body tr:hover) > td {
  background-color: initial;
}

.scheduleTable {
  height: auto;
  width: 100%;
}

:deep(.cellDiv) {
  width: 100%;
  height: 100%;
  background: rgb(159.5, 206.5, 255);
  border: solid 1px #dcdfe6;
  box-sizing: border-box;
  z-index: 999;
  display: flex;
  position: relative;
  left: 0px;
}

:deep(.cellContainer) {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
  z-index: 10;
  position: absolute;
}

:deep(.cell:has(.cellDiv)) {
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0px;
  z-index: -1;
  line-height: 16px !important;
}
.cell:has(.cellContainer) {
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0px;
  z-index: -1;
}

.cellText {
  font-size: 10px;
  height: 100%;
  width: 100%;
  text-align: left;
  align-content: flex-start;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: white;
  z-index: 1000;
}
.cellText * {
  margin: 5px 5px 0px 5px;
  line-height: 10px !important;
}
</style>