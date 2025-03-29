
  <template>
  <div class="scheduleSettingBody">
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
                  v-model="courseDuration"
                  :controls="false"
                >
                  <template #suffix>分钟</template>
                </el-input-number>
              </el-form-item>
              <div class="formItemTitle">
                <el-text>课间设置</el-text>
              </div>
              <el-form-item class="formItem" label="课间时长：">
                <el-input-number
                  class=""
                  v-model="breakDuration"
                  :controls="false"
                >
                  <template #suffix>分钟</template>
                </el-input-number>
              </el-form-item>

              <el-form-item class="formItem">
                <el-checkbox label="上午大课间" v-model="isLongMorningBreak" />
              </el-form-item>
              <el-form-item
                class="formItem"
                v-show="isLongMorningBreak"
                label="上午大课间时长："
              >
                <el-input-number
                  class=""
                  v-model="longMorningBreakDuration"
                  :controls="false"
                >
                  <template #suffix>分钟</template>
                </el-input-number>
              </el-form-item>

              <el-form-item class="formItem">
                <el-checkbox
                  label="下午大课间"
                  v-model="isLongAfternoonBreak"
                />
              </el-form-item>
              <el-form-item
                class="formItem"
                v-show="isLongAfternoonBreak"
                label="下午大课间时长："
              >
                <el-input-number
                  class=""
                  v-model="longAfternoonBreakDuration"
                  :controls="false"
                >
                  <template #suffix>分钟</template>
                </el-input-number>
              </el-form-item>

              <div class="formItemTitle">
                <el-text>节次设置</el-text>
              </div>

              <el-form-item label="上午节次：">
                <el-input-number v-model="morningPeriods" :controls="false">
                </el-input-number>
              </el-form-item>
              <el-form-item label="下午节次：">
                <el-input-number
                  v-model="afternoonPeriods"
                  :controls="false"
                  min="0"
                >
                </el-input-number>
              </el-form-item>
              <el-form-item label="晚上节次：">
                <el-input-number
                  v-model="eveningPeriods"
                  min="0"
                  :controls="false"
                >
                </el-input-number>
              </el-form-item>

              <div class="formItemTitle">
                <el-text>自习设置</el-text>
              </div>
              <el-form-item label="早自习节次：">
                <el-input-number
                  v-model="morningSelfStudyPeriods"
                  min="0"
                  :controls="false"
                >
                </el-input-number>
              </el-form-item>
              <el-form-item label="晚自习节次：">
                <el-input-number
                  v-model="eveningSelfStudyPeriods"
                  :controls="false"
                  min="0"
                >
                </el-input-number>
              </el-form-item>

              <div class="formItemTitle">
                <el-text>晚/午休设置</el-text>
              </div>
              <el-form-item class="formItem" label="午休时间：">
                <el-input-number class="" :controls="false">
                  <template #suffix>分钟</template>
                </el-input-number>
              </el-form-item>
              <el-form-item class="formItem" label="晚休时间：">
                <el-input-number class="" :controls="false">
                  <template #suffix>分钟</template>
                </el-input-number>
              </el-form-item>

              <div class="formItemTitle">
                <el-text>课程时间设置</el-text>
              </div>
              <el-form-item
                v-for="p of timeList"
                :label="`第${p.period}节课：`"
              >
                <template> </template>
                <el-time-picker
                  class="courseTimePicker"
                  v-model="p.timeRange"
                  range-separator="到"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  :disabled-seconds="disabledSecond"
                  is-range
                />
              </el-form-item>
            </el-form>
          </el-scrollbar>
        </div>
      </el-tab-pane>
      <el-tab-pane label="禁排设置" name="prohibitSetting">qwq</el-tab-pane>
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
        max-height="360px"
        :span-method="tableSpan"
        :cell-style="setCellColor"
        @cell-mouse-enter="HandleEnterHover"
        @cell-mouse-leave="HandleLeaveHover"
        @cell-contextmenu="HandleCellRightClick"
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
import { getListTeachingClassApi } from "@/api/schedule/setTeachingClass/teachingClass.api";
import { useRoute } from "vue-router";
import { dayjs } from "element-plus";

export default {
  name: "ScheduleSetting",
  components: {},
  setup() {
    const scheduleConditions = reactive({
      courseDuration: 0, //课程时长
      breakDuration: 0, //课间时长
      isLongMorningBreak: false, //是否有上午大课间
      isLongAfternoonBreak: false, //是否有下午大课间
      longMorningBreakDuration: 0, //上午大课间时长
      longAfternoonBreakDuration: 0, //下午大课间时长
      longMorningBreakPeriods: 0, //上午大课间节次
      longAfternoonBreakPeriods: 0, //下午大课间节次

      morningPeriods: 3, //上午节次
      afternoonPeriods: 2, //下午节次
      eveningPeriods: 1, //晚上节次

      morningSelfStudyPeriods: 1, //早自习节次
      eveningSelfStudyPeriods: 1, //晚自习节次
      timeList: [
        {
          period: 1,
          timeRange: [
            dayjs("8:10", "H:m").toDate(),
            dayjs("9:40", "H:m").toDate(),
          ],
        },
        {
          period: 2,
          timeRange: [
            dayjs("9:50", "H:m").toDate(),
            dayjs("11:15", "H:m").toDate(),
          ],
        },
        {
          period: 3,
          timeRange: [
            dayjs("8:10", "H:m").toDate(),
            dayjs("9:40", "H:m").toDate(),
          ],
        },
        {
          period: 4,
          timeRange: [
            dayjs("8:10", "H:m").toDate(),
            dayjs("9:40", "H:m").toDate(),
          ],
        },
        {
          period: 5,
          timeRange: [
            dayjs("8:10", "H:m").toDate(),
            dayjs("9:40", "H:m").toDate(),
          ],
        },
        {
          period: 6,
          timeRange: [
            dayjs("8:10", "H:m").toDate(),
            dayjs("9:40", "H:m").toDate(),
          ],
        },
        {
          period: 7,
          timeRange: [
            dayjs("8:10", "H:m").toDate(),
            dayjs("9:40", "H:m").toDate(),
          ],
        },
        {
          period: 8,
          timeRange: [
            dayjs("8:10", "H:m").toDate(),
            dayjs("9:40", "H:m").toDate(),
          ],
        },
        {
          period: 9,
          timeRange: [
            dayjs("8:10", "H:m").toDate(),
            dayjs("9:40", "H:m").toDate(),
          ],
        },
        {
          period: 10,
          timeRange: [
            dayjs("8:10", "H:m").toDate(),
            dayjs("9:40", "H:m").toDate(),
          ],
        },
        {
          period: 11,
          timeRange: [
            dayjs("8:10", "H:m").toDate(),
            dayjs("9:40", "H:m").toDate(),
          ],
        },
      ],
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

    const currentSelectValue = ref()

    const scheduleData = ref([
      {
        period: 1,
        dayPeriod: "上午",
        timeRange: ["8:10", "9:35"],
        cellList: [
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
        ],
      },
      {
        period: 2,
        dayPeriod: "上午",
        timeRange: ["8:10", "9:35"],
        cellList: [
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
        ],
      },
      {
        period: 3,
        dayPeriod: "上午",
        timeRange: ["8:10", "9:35"],
        cellList: [
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 2,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
        ],
      },
      {
        period: 4,
        dayPeriod: "上午",
        timeRange: ["8:10", "9:35"],
        cellList: [
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 2,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
        ],
      },
      {
        period: 5,
        dayPeriod: "下午",
        timeRange: ["8:10", "9:35"],
        cellList: [
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 2,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
        ],
      },
      {
        period: 6,
        dayPeriod: "下午",
        timeRange: ["8:10", "9:35"],
        cellList: [
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 2,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
        ],
      },
      {
        period: 7,
        dayPeriod: "晚上",
        timeRange: ["8:10", "9:35"],
        cellList: [
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 2,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
        ],
      },
      {
        period: 8,
        dayPeriod: "晚上",
        timeRange: ["8:10", "9:35"],
        cellList: [
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 2,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
          {
            type: 1,
            isHover: false,
            isEdit: false,
          },
        ],
      },
    ]);

    onMounted(() => {
      scheduleData.value = setListRowspan(scheduleData.value);
    });

    //type  1:正课  2:补课  3:早自习  4:晚自习
    // const scheduleData = computed(() => {
    //   let res = [];
    //   for (let i = 1; i <= scheduleConditions.morningSelfStudyPeriods; i++) {
    //     res.push({
    //       period: i,
    //       dayPeriod: "早自习",
    //       timeRange: [HandleDate("8:10"), HandleDate("9:35")],
    //       MonData: {
    //         type: 3,
    //       },
    //       TueData: {
    //         type: 3,
    //       },
    //       WedData: {
    //         type: 3,
    //       },
    //       ThuData: {
    //         type: 3,
    //       },
    //       FriData: {
    //         type: 3,
    //       },
    //       SatData: {
    //         type: 2,
    //       },
    //       SunData: {
    //         type: 2,
    //       },
    //     });
    //   }
    //   for (
    //     let i = scheduleConditions.morningSelfStudyPeriods + 1;
    //     i <=
    //     scheduleConditions.morningPeriods +
    //       scheduleConditions.morningSelfStudyPeriods;
    //     i++
    //   ) {
    //     res.push({
    //       period: i,
    //       dayPeriod: "上午",
    //       timeRange: [HandleDate("8:10"), HandleDate("9:35")],
    //       MonData: {
    //         type: 1,
    //       },
    //       TueData: {
    //         type: 1,
    //       },
    //       WedData: {
    //         type: 1,
    //       },
    //       ThuData: {
    //         type: 1,
    //       },
    //       FriData: {
    //         type: 1,
    //       },
    //       SatData: {
    //         type: 2,
    //       },
    //       SunData: {
    //         type: 2,
    //       },
    //     });
    //   }
    //   for (
    //     let i =
    //       scheduleConditions.morningPeriods +
    //       scheduleConditions.morningSelfStudyPeriods +
    //       1;
    //     i <=
    //     scheduleConditions.afternoonPeriods +
    //       scheduleConditions.morningPeriods +
    //       scheduleConditions.morningSelfStudyPeriods;
    //     i++
    //   ) {
    //     res.push({
    //       period: i,
    //       dayPeriod: "下午",
    //       timeRange: [HandleDate("8:10"), HandleDate("9:35")],

    //       MonData: {
    //         type: 1,
    //       },
    //       TueData: {
    //         type: 1,
    //       },
    //       WedData: {
    //         type: 1,
    //       },
    //       ThuData: {
    //         type: 1,
    //       },
    //       FriData: {
    //         type: 1,
    //       },
    //       SatData: {
    //         type: 2,
    //       },
    //       SunData: {
    //         type: 2,
    //       },
    //     });
    //   }

    //   for (
    //     let i =
    //       scheduleConditions.morningPeriods +
    //       scheduleConditions.afternoonPeriods +
    //       scheduleConditions.morningSelfStudyPeriods +
    //       1;
    //     i <=
    //     scheduleConditions.afternoonPeriods +
    //       scheduleConditions.morningPeriods +
    //       scheduleConditions.morningSelfStudyPeriods +
    //       scheduleConditions.eveningPeriods;
    //     i++
    //   ) {
    //     res.push({
    //       period: i,
    //       dayPeriod: "晚上",
    //       timeRange: [HandleDate("8:10"), HandleDate("9:35")],
    //       MonData: {
    //         type: 2,
    //       },
    //       TueData: {
    //         type: 2,
    //       },
    //       WedData: {
    //         type: 2,
    //       },
    //       ThuData: {
    //         type: 2,
    //       },
    //       FriData: {
    //         type: 2,
    //       },
    //       SatData: {
    //         type: 2,
    //       },
    //       SunData: {
    //         type: 2,
    //       },
    //     });
    //   }
    //   for (
    //     let i =
    //       scheduleConditions.morningPeriods +
    //       scheduleConditions.afternoonPeriods +
    //       scheduleConditions.morningSelfStudyPeriods +
    //       scheduleConditions.eveningPeriods +
    //       1;
    //     i <=
    //     scheduleConditions.afternoonPeriods +
    //       scheduleConditions.morningPeriods +
    //       scheduleConditions.eveningPeriods +
    //       scheduleConditions.morningSelfStudyPeriods +
    //       scheduleConditions.eveningSelfStudyPeriods;
    //     i++
    //   ) {
    //     res.push({
    //       period: i,
    //       dayPeriod: "晚自习",
    //       timeRange: [HandleDate("8:10"), HandleDate("9:35")],
    //       MonData: {
    //         type: 4,
    //       },
    //       TueData: {
    //         type: 4,
    //       },
    //       WedData: {
    //         type: 4,
    //       },
    //       ThuData: {
    //         type: 4,
    //       },
    //       FriData: {
    //         type: 4,
    //       },
    //       SatData: {
    //         type: 4,
    //       },
    //       SunData: {
    //         type: 4,
    //       },
    //     });
    //   }
    //   return setListRowspan(res);
    // });

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

    const getUpdateTable = () => {
      //获取更新后的表格
    };

    const getUpdateForm = () => {
      //获取更新后的表单
    };

    const updateForm = () => {
      //发送请求更新表单;
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

    const HandleDate = (dateArray) => {
      return [
        dayjs(dateArray[0], "H:m").toDate(),
        dayjs(dateArray[1], "H:m").toDate(),
      ];
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
            return { background: "#ffa8a8" };
          case 2:
            return { background: "#add8ff" };
          case 1:
            return { background: "#fffb06" };
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

    };

    const HandleCellSelectBlur = (scope) => {
      let temp = scheduleData.value[scope.row.period - 1];
      temp.cellList[scope.column.no - 2].isEdit = false;
      temp.cellList[scope.column.no - 2].isHover = false;
      currentCellRef.value = {};
    };

    const HandleCellRightClick = (row, column, cell, event) => {};

    return {
      ...toRefs(scheduleConditions),
      scheduleConditions,
      scheduleData,
      periodsFormatter,
      tableSpan,
      HandleDate,
      dateFormate,
      disabledSecond,
      setCellColor,
      HandleCellRightClick,
      HandleEnterHover,
      HandleLeaveHover,
      HandleEditLinkClick,
      HandleCellSelectChange,
      HandleCellSelectBlur,
      currentCellRef,
      currentTab,
      tableHeader,
      setListRowspan,
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
  width: 25%;
  margin: 10px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.settingMenu {
  width: auto;
}

.scheduleTableDiv {
  width: 70%;
  margin: 10px 10px 10px 0px;
  padding: 10px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.scheduleTable {
  height: auto;
  width: auto;
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

.courseTimePicker {
  width: 100px;
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
  background: #ffa8a8;
}
.color2 {
  background: #fffb06;
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
</style>