
  <template>
  <div class="setTeachingClassBody">
    <el-tabs
      class="courseTab"
      v-model="currentCourse"
      type="border-card"
      @tab-change="HandleTabChange"
    >
      <el-tab-pane
        class="courseTabPane"
        v-for="course of courseList"
        :name="course.id"
        :label="course.name"
        :key="course.id"
        :lazy="true"
      >
        <div class="courseTabPaneBody">
          <el-table
            class="teachingClassTable"
            :data="currentTeachingClassList"
            :span-method="tableSpan"
            height="440px"
            max-height="500px"
            fit
          >
            <el-table-column prop="perWeekCourseHour" label="周学时">
            </el-table-column>
            <el-table-column prop="id" label="教学班编号"> </el-table-column>
            <el-table-column prop="name" label="教学班名称"> </el-table-column>
            <el-table-column label="组成班级" v-slot="scope" min-width="110px">
              <el-scrollbar height="60px">
                <el-tag class="classTag" v-for="cl of scope.row.classList">{{
                  cl.name
                }}</el-tag>
              </el-scrollbar>
            </el-table-column>
            <el-table-column
              label="上课周次"
              prop="courseStartWeekHours"
              :formatter="courseStartWeekHoursFormatter"
            ></el-table-column>
            <el-table-column
              label="教学班人数"
              prop="teachingClassSize"
            ></el-table-column>
            <el-table-column label="操作" v-slot="scope" min-width="200px">
              <div class="RowButtons">
                <el-link type="primary" @click="HandleEditClick(scope.row)"
                  >编辑</el-link
                >
              </div>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
  <SetTeachingClassDialog />
</template>

<script>
import { onMounted, ref } from "vue";
import SetTeachingClassDialog from "./SetTeachingClassDialog.vue";
import bus from "@/bus/bus";
import { getListTeachingClassApi } from "@/api/schedule/setTeachingClass/teachingClass.api";
import { getCourseListApi } from "@/api/schedule/setCourseHour/courseList.api";
import { useRoute } from "vue-router";
export default {
  name: "SetTeachingClass",
  components: {
    SetTeachingClassDialog,
  },
  setup() {
    const currentCourse = ref();
    const courseList = ref([
      
    ]);
    const currentTeachingClassList = ref([]);
    const route = useRoute();
    const taskId = route.query.id;

    onMounted(() => {
      getCourseList().then((res) => {
        if (res === 200) {
          if (courseList.value.length) {
            currentCourse.value = courseList.value[0].id;
            getTeachingClassList();
          }
        }
      });
    });

    const getCourseList = () => {
      return getCourseListApi(taskId).then((res) => {
        if (res) {
          if (res.meta.code === 200) {
            courseList.value = res.data;
            return 200;
          }
        }
      });
    };

    const getTeachingClassList = () => {
      getListTeachingClassApi(taskId, currentCourse.value).then((res) => {
        if (res.meta.code === 200) {
          currentTeachingClassList.value = setListRowspan(res.data.sort(
            (a,b)=>a.perWeekCourseHour - b.perWeekCourseHour
          ));
        }
      });
    };    

    const HandleTabChange = () => {
      getTeachingClassList()
    };

    const HandleEditClick = (row) => {
      bus.emit("showSetTeachingClassDialog", row);
    };

    const setListRowspan = (teachingClassList) => {
      teachingClassList.forEach((item) => {
        item.rowspan = 1;
      });
      for (let i = 0; i < teachingClassList.length; i++) {
        for (let j = i + 1; j < teachingClassList.length; j++) {
          if (
            teachingClassList[i].perWeekCourseHour ==
            teachingClassList[j].perWeekCourseHour
          ) {
            teachingClassList[i].rowspan++;
            teachingClassList[j].rowspan--;
          }
        }
        i = i + teachingClassList[i].rowspan - 1;
      }
      return teachingClassList;
    };

    const tableSpan = ({ row, column, rowIndex, columnIndex }) => {
      if (columnIndex == 0) {
        return [row.rowspan, 1];
      } else {
        return [1, 1];
      }
    };

    const courseStartWeekHoursFormatter = (row, dom, value) => {
      let res = "";
      value.forEach((time) => {
        res += `${time.courseStartWeeks}-${time.courseEndWeeks}周;`;
      });
      return res;
    };

    return {
      currentCourse,
      HandleEditClick,
      HandleTabChange,
      currentTeachingClassList,
      courseList,
      tableSpan,
      courseStartWeekHoursFormatter,
    };
  },
};
</script>


<style scoped>
.setTeachingClassBody {
  height: 520px;
  display: flex;
  margin: 10px 0px 0px 0px;
  flex-direction: column;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.courseTab {
  height: 100%;
  margin: 10px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
}
:deep(.courseTab .el-tabs__content) {
  padding: 0px;
}
.classTab {
  height: 100%;
  overflow: hidden;
}

.classTabPaneBody {
  height: max-content;
}

.teachingClassTable {
  width: auto;
  height: 100%;
  padding: 0px 10px;
  margin: 10px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.classTag {
  margin: 5px;
}
</style>