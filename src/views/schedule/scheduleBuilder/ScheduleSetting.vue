
  <template>
  <div class="scheduleSettingBody" v-loading="isLoading">
    <el-tabs class="settingTab" v-model="currentTab" stretch type="border-card">
      <el-tab-pane label="作息设置" name="scheduleSetting">
        <div class="settingMenu">
          <el-scrollbar height="345px" style="padding-right: 10px">
            <el-form label-position="left" label-width="auto">
              <div class="formItemTitle">
                <el-text>课程设置</el-text>
              </div>

              <el-form-item class="formItem" label="课程时长：">
                <el-input-number
                  class=""
                  v-model="scheduleConditions.data.courseDuration"
                  :controls="false"
                  @change="HandleCourseDurationChange"
                >
                  <template #suffix>分钟</template>
                </el-input-number>
              </el-form-item>

              <div class="formItemTitle">
                <el-text>节次设置</el-text>
              </div>

              <el-form-item label="上午节次：">
                <el-input-number
                  v-model="scheduleConditions.data.morningPeriods"
                  :controls="false"
                  @change="HandlePeriodChange(2)"
                >
                </el-input-number>
              </el-form-item>
              <el-form-item label="下午节次：">
                <el-input-number
                  v-model="scheduleConditions.data.afternoonPeriods"
                  :controls="false"
                  min="0"
                  @change="HandlePeriodChange(3)"
                >
                </el-input-number>
              </el-form-item>
              <el-form-item label="晚上节次：">
                <el-input-number
                  v-model="scheduleConditions.data.eveningPeriods"
                  min="0"
                  :controls="false"
                  @change="HandlePeriodChange(4)"
                >
                </el-input-number>
              </el-form-item>

              <div class="formItemTitle">
                <el-text>课间设置</el-text>
              </div>
              <el-form-item class="formItem" label="课间时长：">
                <el-input-number
                  class=""
                  v-model="scheduleConditions.data.breakDuration"
                  @change="HandleBreakDurationChange"
                  :controls="false"
                >
                  <template #suffix>分钟</template>
                </el-input-number>
              </el-form-item>

              <div class="formItemTitle">
                <el-text>大课间设置</el-text>
              </div>

              <el-form-item class="LongBreakformItem">
                <div>
                  <div
                    class="longBreakItem"
                    v-for="longbreak of scheduleConditions.data.longBreakList"
                  >
                    <span>
                      {{ `大课间${longbreak.index}：` }}
                    </span>
                    <div class="longBreakInputContainer">
                      <div class="longBreakInput">
                        <el-text class="longBreakText">时长：</el-text>
                        <el-input-number
                          class="timeInput"
                          v-model="longbreak.duration"
                          @change="updateLongBreakDuration"
                          :controls="false"
                        >
                          <template #suffix>分钟</template>
                        </el-input-number>
                      </div>

                      <div class="longBreakInput">
                        <el-text class="longBreakText">节次：</el-text>
                        <el-input-number
                          label="节次:"
                          class="timeInput"
                          v-model="longbreak.duration"
                          @change="HandleLongBreakChange(longBreak.index)"
                          :controls="false"
                        >
                        </el-input-number>
                      </div>
                      <el-button
                        class="longBreakDeleteButton"
                        type="danger"
                        @click="HandleDeleteLongBreakClick(longBreak.index)"
                        >删除</el-button
                      >
                    </div>
                  </div>
                  <el-button
                    class="longBreakAddButton"
                    type="primary"
                    @click="HandleCreateLongBreakClick"
                    >添加</el-button
                  >
                </div>
              </el-form-item>

              <div class="formItemTitle">
                <el-text>自习设置</el-text>
              </div>
              <el-form-item label="早自习节次：">
                <el-input-number
                  v-model="scheduleConditions.data.morningSelfStudyPeriods"
                  min="0"
                  :controls="false"
                  @change="HandlePeriodChange(1)"
                >
                </el-input-number>
              </el-form-item>
              <el-form-item label="晚自习节次：">
                <el-input-number
                  v-model="scheduleConditions.data.eveningSelfStudyPeriods"
                  :controls="false"
                  min="0"
                  @change="HandlePeriodChange(5)"
                >
                </el-input-number>
              </el-form-item>

              <div class="formItemTitle">
                <el-text>晚/午休设置</el-text>
              </div>
              <el-form-item class="formItem" label="午休时间：">
                <el-input-number
                  class=""
                  :controls="false"
                  v-model="scheduleConditions.data.lunchBreakDuration"
                  @change="HandleRestTimeDurationChange(0)"
                >
                  <template #suffix>分钟</template>
                </el-input-number>
              </el-form-item>
              <el-form-item class="formItem" label="晚休时间：">
                <el-input-number
                  class=""
                  :controls="false"
                  v-model="scheduleConditions.data.eveningBreakDuration"
                  @change="HandleRestTimeDurationChange(1)"
                >
                  <template #suffix>分钟</template>
                </el-input-number>
              </el-form-item>

              <div class="formItemTitle">
                <el-text>课程时间设置</el-text>
              </div>
              <el-form-item
                class="timepickerItem"
                v-for="p of scheduleConditions.data.timeList"
                :label="`第${p.period}节课：`"
              >
                <el-time-picker
                  class="courseTimePicker"
                  v-model="p.timeRange"
                  range-separator="到"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="HH-mm"
                  default-value="00:00"
                  :disabled-seconds="disabledSecond"
                  is-range
                  @change="HandlePeriodTimeChange(p.period)"
                  :clearable="false"
                />
              </el-form-item>
            </el-form>
          </el-scrollbar>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="scheduleTableDiv">
      <div class="showColor">
        <div class="colorItem">
          <el-text class="colorText">正课:</el-text>
          <div class="color2 colorDiv"></div>
        </div>
        <div class="colorItem">
          <el-text class="colorText">补课:</el-text>
          <div class="color3 colorDiv"></div>
        </div>
        <div class="colorItem">
          <el-text class="colorText">早自习:</el-text>
          <div class="color1 colorDiv"></div>
        </div>
        <div class="colorItem">
          <el-text class="colorText">晚自习:</el-text>
          <div class="color4 colorDiv"></div>
        </div>
      </div>

      <el-table
        class="scheduleTable"
        :data="scheduleData"
        :border="true"
        max-height="400px"
        :span-method="tableSpan"
        :cell-style="setCellColor"
        @cell-mouse-enter="HandleEnterHover"
        @cell-mouse-leave="HandleLeaveHover"
        @contextmenu.prevent
      >
        <el-table-column prop="dayPeriod" width="70px"> </el-table-column>

        <el-table-column label="节次/周次" width="150px" prop="periodColumn">
          <template #default="scope">
            <span>第{{ scope.row.period }}节</span>
            <span>{{
              `(${scope.row.timeRange[0]}-${scope.row.timeRange[1]})`
            }}</span>
          </template>
        </el-table-column>

        <el-table-column v-for="column of tableHeader" :label="column.name">
          <template #default="scope">
            <el-link
              class="cellLink"
              type="primary"
              @click="HandleEditLinkClick(scope)"
              v-show="
                scope.row.cellList[scope.column.no - 2].isHover &&
                !scope.row.cellList[scope.column.no - 2].isEdit
              "
              >修改</el-link
            >
            <el-select
              v-model="scope.row.cellList[scope.column.no - 2].type"
              class="cellSelect"
              size="small"
              ref="currentCellRef"
              v-if="scope.row.cellList[scope.column.no - 2].isEdit"
              @change="HandleCellSelectChange(scope)"
              @blur="HandleCellSelectBlur(scope)"
            >
              <el-option label="正课" :value="1" />
              <el-option label="补课" :value="2" />
              <el-option label="早自习" :value="3" />
              <el-option label="晚自习" :value="4" />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { computed, nextTick, onMounted, reactive, ref, toRefs } from "vue";
import bus from "@/bus/bus";
import {
  createLongBreakApi,
  updateLongBreakApi,
  deleteLongBreakApi,
} from "@/api/schedule/scheduleSetting/longBreak.api";
import { getListTeachingClassApi } from "@/api/schedule/setTeachingClass/teachingClass.api";
import {
  getScheduleRoutineApi,
  updateCourseDurationApi,
  updateBreakDurationApi,
  updatePeriodApi,
  updatePeriodTimeApi,
  updateRestTimeDurationApi,
} from "@/api/schedule/scheduleSetting/scheduleRoutine.api";
import {
  getScheduleSettingStructApi,
  updateScheduleSettingStructApi,
} from "@/api/schedule/scheduleSetting/scheduleData.api";
import { useRoute } from "vue-router";
import { dayjs } from "element-plus";

export default {
  name: "ScheduleSetting",
  components: {},
  setup() {
    const taskId = useRoute().query.id;
    const isLoading = ref(false);
    const scheduleConditions = reactive({
      data: {
        courseDuration: 0, //课程时长
        breakDuration: 0, //课间时长
        morningPeriods: 3, //上午节次
        afternoonPeriods: 2, //下午节次
        eveningPeriods: 1, //晚上节次
        hasMorningSelfStudy: true, //是否有早自习
        hasEveningSelfStudy: true, //是否有晚自习
        morningSelfStudyPeriods: 1, //早自习节次
        eveningSelfStudyPeriods: 1, //晚自习节次
        lunchBreakDuration: 120, //午休时长
        eveningBreakDuration: 120, //晚休时长
        longBreakList: [
          {
            index: 1,
            duration: 15,
            period: 2, //在第几节课之后
          },
          {
            index: 2,
            duration: 15,
            period: 4, //在第几节课之后
          },
        ],
        timeList: [],
      },
    });

    const timeListTemp = ref([]);

    const tableHeader = [
      { name: "星期一", prop: "MonData" },
      { name: "星期二", prop: "TueData" },
      { name: "星期三", prop: "WedData" },
      { name: "星期四", prop: "ThuData" },
      { name: "星期五", prop: "FriData" },
      { name: "星期六", prop: "SatData" },
      { name: "星期日", prop: "SunData" },
    ];

    const currentSelectValue = ref();

    const scheduleData = ref([]);

    onMounted(() => {
      getScheduleRoutine();
      getScheduleSettingStruct();
    });

    const disabledSecond = () => {
      return [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
        39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
        57, 58, 59,
      ];
    };

    const currentCellRef = ref(); //每个单元格里select的ref

    const currentTab = ref("scheduleSetting");

    let timer;
    const debounce = function (fun, delay) {
      //防抖函数
      return function () {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          fun();
        }, delay);
      };
    };

    const getScheduleRoutine = () => {
      isLoading.value = true;
      getScheduleRoutineApi(taskId)
        .then((res) => {
          if (res) {
            if (res.meta.code == 200) {
              Object.assign(scheduleConditions.data, res.data);
              scheduleConditions.data.timeList = res.data.timeList;
            }
          }
        })
        .finally(() => {
          isLoading.value = false;
        });
    };

    const HandleCourseDurationChange = () => {
      debounce(() => {
        updateCourseDuration();
      }, 400)();
    };
    const HandleBreakDurationChange = () => {
      debounce(() => {
        updateBreakDuration();
      }, 400)();
    };

    const HandleCreateLongBreakClick = () => {
      debounce(() => {
        createLongBreak();
      }, 400)();
    };
    const HandleDeleteLongBreakClick = (index) => {
      debounce(() => {
        deleteLongBreak(index);
      }, 400)();
    };
    const HandleLongBreakChange = (index) => {
      debounce(() => {
        updateLongBreak(index);
      }, 400)();
    };

    const HandlePeriodTimeChange = (period) => {
      if (scheduleConditions.data.timeList[period - 1].timeRange) {
        debounce(() => {
          updatePeriodTime(
            period,
            scheduleConditions.data.timeList[period - 1].timeRange
          );
        }, 400)();
      }
    };

    const HandleRestTimeDurationChange = (index) => {
      debounce(() => {
        switch (index) {
          case 0:
            updateRestTimeDuration(
              0,
              scheduleConditions.data.lunchBreakDuration
            );
            break;
          case 1:
            updateRestTimeDuration(
              1,
              scheduleConditions.data.eveningBreakDuration
            );
            break;
        }
      }, 400)();
    };

    const HandlePeriodChange = (daytime) => {
      debounce(() => {
        switch (daytime) {
          case 1:
            updatePeriod(
              daytime,
              scheduleConditions.data.morningSelfStudyPeriods
            );
            break;
          case 2:
            updatePeriod(daytime, scheduleConditions.data.morningPeriods);
            break;
          case 3:
            updatePeriod(daytime, scheduleConditions.data.afternoonPeriods);
            break;
          case 4:
            updatePeriod(daytime, scheduleConditions.data.eveningPeriods);
            break;
          case 5:
            updatePeriod(
              daytime,
              scheduleConditions.data.eveningSelfStudyPeriods
            );
            break;
        }
      }, 400)();
    };

    const updateCourseDuration = () => {
      //更新课程时长
      updateBreakDurationApi(
        taskId,
        scheduleConditions.data.courseDuration
      ).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            getScheduleRoutine();
          }
        }
      });
    };
    const updateBreakDuration = () => {
      //更新课间时长
      updateBreakDurationApi(
        taskId,
        scheduleConditions.data.breakDuration
      ).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            getScheduleRoutine();
          }
        }
      });
    };

    const createLongBreak = () => {
      //添加大课间
      createLongBreakApi(taskId).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            getScheduleRoutine();
          }
        }
      });
    };
    const deleteLongBreak = (index) => {
      //删除大课间
      deleteLongBreakApi(taskId, index).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            getScheduleRoutine();
          }
        }
      });
    };
    const updateLongBreak = (period) => {
      //更新大课间
      let duration = scheduleConditions.data.longBreakList[period - 1].duration;
      updateLongBreakApi(taskId, index, period, duration).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            getScheduleRoutine();
          }
        }
      });
    };

    const updatePeriod = (daytime, newValue) => {
      //更新节次
      //1早自习2上午3下午4晚上5晚自习
      updatePeriodApi(taskId, daytime, newValue).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            getScheduleRoutine();
          }
        }
      });
    };

    const updatePeriodTime = (period, newValue) => {
      //更新节次时间
      updatePeriodTimeApi(taskId, period, newValue).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            getScheduleRoutine();
          }
        }
      });
    };

    const updateRestTimeDuration = (index, newValue) => {
      //更新午休/晚休时长
      updateRestTimeDurationApi(taskId, index, newValue).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            getScheduleRoutine();
          }
        }
      });
    };

    const getScheduleSettingStruct = () => {
      isLoading.value = true;
      getScheduleSettingStructApi(taskId).then((res) => {
        if (res) {
          if (res.meta.code == 200) {
            scheduleData.value = res.data;
            scheduleData.value = setListRowspan(scheduleData.value);
            isLoading.value = false;
          }
        }
      });
    };

    const updateScheduleSettingStruct = (period, cellIndex, type) => {
      console.log(taskId, period, cellIndex, type);
      updateScheduleSettingStructApi(taskId, period, cellIndex, type).then(
        (res) => {
          if (res) {
            if (res.meta.code == 200) {
              getScheduleSettingStruct();
            }
          }
        }
      );
    };

    const periodsFormatter = (input) => {
      return `第${input.periods}节`;
    };

    const setListRowspan = (List) => {
      List.forEach((item) => {
        item.rowspan = 1;
      });
      for (let i = 0; i < List.length; i++) {
        for (let j = i + 1; j < List.length; j++) {
          if (List[i].dayPeriod == List[j].dayPeriod) {
            List[i].rowspan++;
            List[j].rowspan--;
          }
        }
        i = i + List[i].rowspan - 1;
      }
      return List;
    };

    const tableSpan = ({ row, column, rowIndex, columnIndex }) => {
      if (columnIndex == 0) {
        return [row.rowspan, 1];
      } else {
        return [1, 1];
      }
    };

    const HandleDateStringArray = (dateArray) => {
      if (dateArray[0] && dateArray[1]) {
        return [
          dayjs(dateArray[0], "HH:mm").toDate(),
          dayjs(dateArray[1], "HH:mm").toDate(),
        ];
      } else {
        return [
          dayjs("00:00", "HH:mm").toDate(),
          dayjs("00:01", "HH:mm").toDate(),
        ];
      }
    };
    const HandleDateArray = (dateArray) => {
      console.log(dateArray);
      if (dateArray[0] && dateArray[1]) {
        return [
          dayjs(dateArray[0]).format("HH:mm"),
          dayjs(dateArray[1]).format("HH:mm"),
        ];
      } else {
        return ["00:00", "00:01"];
      }
    };

    const dateFormate = (datyObj) => {
      return dayjs(datyObj).format("H:m");
    };

    const setCellColor = (cell) => {
      if (cell.columnIndex >= 2) {
        switch (
          scheduleData.value[cell.rowIndex].cellList[cell.columnIndex - 2].type
        ) {
          case 3:
            return { background: "#ffd479" };
          case 2:
            return { background: "#add8ff" };
          case 1:
            return { background: "#fdffbf" };
          case 4:
            return { background: "#0065bd" };
          default:
            return "";
        }
      }
    };

    const HandleEnterHover = (row, column, cell, event) => {
      if (row.period >= 1 && column.no >= 2) {
        scheduleData.value[row.period - 1].cellList[
          column.no - 2
        ].isHover = true;
      }
    };
    const HandleLeaveHover = (row, column, cell, event) => {
      if (row.period >= 1 && column.no >= 2) {
        scheduleData.value[row.period - 1].cellList[
          column.no - 2
        ].isHover = false;
      }
    };

    const HandleEditLinkClick = (scope) => {
      let temp =
        scheduleData.value[scope.row.period - 1].cellList[scope.column.no - 2];

      temp.isEdit = true;
      temp.isHover = false;
      nextTick(() => {
        currentCellRef.value[0].focus();
      });
    };

    const HandleCellSelectChange = (scope) => {
      let temp = scheduleData.value[scope.row.period - 1];
      temp.cellList[scope.column.no - 2].isEdit = false;
      temp.cellList[scope.column.no - 2].isHover = false;
      updateScheduleSettingStruct(
        scope.row.period,
        scope.column.no - 2,
        scheduleData.value[scope.row.period - 1].cellList[scope.column.no - 2]
          .type
      );
    };

    const HandleCellSelectBlur = (scope) => {
      let temp = scheduleData.value[scope.row.period - 1];
      temp.cellList[scope.column.no - 2].isEdit = false;
      temp.cellList[scope.column.no - 2].isHover = false;
      currentCellRef.value = {};
    };

    return {
      ...toRefs(scheduleConditions),
      scheduleConditions,
      scheduleData,
      periodsFormatter,
      tableSpan,
      HandleDateStringArray,
      dateFormate,
      disabledSecond,
      setCellColor,
      HandleEnterHover,
      HandleLeaveHover,
      HandleEditLinkClick,
      HandleCellSelectChange,
      HandleCellSelectBlur,
      currentCellRef,
      currentTab,
      tableHeader,
      setListRowspan,
      HandleCourseDurationChange,
      HandleBreakDurationChange,
      HandleCreateLongBreakClick,
      HandleDeleteLongBreakClick,
      HandleLongBreakChange,
      HandlePeriodTimeChange,
      HandleRestTimeDurationChange,
      HandlePeriodChange,
      HandleDateArray,
      isLoading,
      updateScheduleSettingStruct,
    };
  },
};
</script>


<style scoped>
.scheduleSettingBody {
  height: 520px;
  display: flex;
  margin: 10px 0px 0px 0px;
  flex-direction: row;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.settingTab {
  width: 30%;
  margin: 10px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.settingMenu {
  width: auto;
}

.scheduleTableDiv {
  width: 69%;
  margin: 10px 10px 10px 0px;
  padding: 10px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.scheduleTable {
  height: auto;
  width: auto;
}

.formItemTitle .el-text {
  font-size: 16px;
  font-weight: bold;
}

.formItemTitle {
  margin: 10px 0px;
}
.menuTitle {
  font-weight: bold;
  margin: 5px 0px;
}

.courseTimePicker {
  width: 100px;
}
.timeInput {
  height: 30px;
  width: 100px;
  margin: 5px 0px;
}

.formItem {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: left;
  position: relative;
}

.longBreakInput {
  width: auto;
  height: max-content;
  display: flex;
  flex-direction: row;
}
.longBreakItem {
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
}

.longBreakInputContainer {
  display: flex;
  flex-direction: row;
}

:deep(.LongBreakformItem .el-form-item__content) {
  display: flex;
  justify-content: center;
}

.longBreakText {
  white-space: nowrap;
}

.showColor {
  height: 20px;
  margin: 0px 5px 5px 5px;
  display: flex;
  flex-direction: row;
  justify-self: left;
}

.colorText {
  font-size: 12px;
}

.colorItem {
  display: flex;
  flex-direction: row;
  width: 60px;
  margin-right: 5px;
}
.colorDiv {
  width: 20px;
  height: 10px;
  margin: auto;
  border-radius: 5px;
}

.color1 {
  background: #ffd479;
}
.color2 {
  background: #fdffbf;
}
.color3 {
  background: #add8ff;
}
.color4 {
  background: #0065bd;
}

.cellSelect {
}

.cellLink {
  display: flex;
  font-size: 12px;
  text-underline-offset: unset;
}
.longBreakDeleteButton {
  width: 100%;
  height: auto;
  margin-left: 5px;
  margin-top: 5px;
  align-self: baseline;
}

.longBreakAddButton {
  width: 100%;
  height: 25px;
}

.timepickerItem {
  width: auto;
}
</style>