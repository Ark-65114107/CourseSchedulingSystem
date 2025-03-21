
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
            height="345px"
            fit
          >
            <el-table-column prop="perWeekCourseHour" label="周学时">
            </el-table-column>
            <el-table-column prop="code" label="教学班编号"> </el-table-column>
            <el-table-column prop="name" label="教学班名称"> </el-table-column>
            <el-table-column label="组成班级" v-slot="scope" min-width="110px">
              <el-scrollbar height="60px">
                <el-tag class="classTag" v-for="cl of scope.row.classList">{{
                  cl.name
                }}</el-tag>
              </el-scrollbar>
            </el-table-column>
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
import { useRoute } from "vue-router";
export default {
  name: "SetTeachingClass",
  components: {
    SetTeachingClassDialog,
  },
  setup() {
    const currentCourse = ref();
    const courseList = ref([
      {
        id: "gdsx1",
        name: "高等数学(一)",
      },
      {
        id: "c1sfsf",
        name: "C语言程序基础A",
      },
      {
        id: "en4g",
        name: "英语",
      },
      {
        id: "c42",
        name: "C语言程序基础B",
      },
      {
        id: "ls5sx",
        name: "离散数学",
      },
      {
        id: "xx2ds",
        name: "线性代数",
      },
      {
        id: "Ja4va",
        name: "Java程序设计",
      },
      {
        id: "mks",
        name: "马克思主义",
      },
      {
        id: "jds",
        name: "中国近代史纲要",
      },
      {
        id: "mr1fz",
        name: "明日方舟",
      },
      {
        id: "jsll",
        name: "军事理论",
      },
      {
        id: "peclass",
        name: "体育课",
      },
      {
        id: "acmpro",
        name: "ACM程序设计竞赛进阶",
      },
    ]);
    const currentTeachingClassList = ref([]);
    const route = useRoute();
    const taskId = route.query.id;

    onMounted(() => {
      currentCourse.value = courseList.value[0].id;
      getTeachingClassList.apply();
    });

    const getTeachingClassList = () => {
      getListTeachingClassApi(taskId, currentCourse.value).then((res) => {
        if (res.meta.code === 200) {
          console.log(res);
          currentTeachingClassList.value = setListRowspan(res.data);
        }
      });
    };

    const HandleTabChange = () => {
      getTeachingClassList.apply();
    };

    const HandleEditClick = (row) => {
      console.log(row);
      bus.emit("showSetTeachingClassDialog", row, currentCourse.value);
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

    return {
      currentCourse,
      HandleEditClick,
      HandleTabChange,
      currentTeachingClassList,
      courseList,
      tableSpan,
    };
  },
};
</script>


<style scoped>
.setTeachingClassBody {
  height: 425px;
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
  height: 280px;
  padding: 0px 10px;
  margin: 10px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.classTag {
  margin: 5px;
}
</style>