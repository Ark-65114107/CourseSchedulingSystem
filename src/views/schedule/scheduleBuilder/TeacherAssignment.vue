
  <template>
  <div class="teacherAssignmentBody">
    <el-button
      class="switchViewButton"
      v-if="viewMode"
      @click="HandleViewSwitch"
      type="warning"
      size="small"
      ><el-icon><Refresh /></el-icon> 教师视角</el-button
    >
    <el-button
      class="switchViewButton"
      v-else
      @click="HandleViewSwitch"
      type="warning"
      size="small"
      ><el-icon><Refresh /></el-icon> 教学班视角</el-button
    >

    <div class="teacherViewDiv" v-if="!viewMode">
      <el-table class="viewTable" :data="teacherList" max-height="365px">
        <el-table-column label="教师姓名" prop="name"></el-table-column>
        <el-table-column label="教学班" v-slot="scope">
          <div class="TagDiv">
            <el-popover
              v-for="tc of scope.row.classlist"
              width="200"
              trigger="hover"
            >
              <el-text> 教学班编号：{{ tc.id }} </el-text>
              <el-text> 班级： </el-text>
              <el-text v-for="cl of tc.classlist">{{ cl.name }},<br /></el-text>

              <template #reference>
                <el-tag class="classTag">{{ tc.name }}</el-tag>
              </template>
            </el-popover>
          </div>
        </el-table-column>
        <el-table-column label="操作" v-slot="scope">
          <el-link type="primary" @click="HandleTeacherEditClick(scope.row)"
            >修改</el-link
          >
        </el-table-column>
      </el-table>
    </div>

    <div class="teachingClassViewDiv" v-else>
      <!-- <el-table class="viewTable" :data="teachingClassList" max-height="365px">
        <el-table-column label="教学班" prop="name"></el-table-column>
        <el-table-column label="任课教师" v-slot="scope">
          <div class="TagDiv">
            <el-tag class="classTag" v-for="cl of scope.row.classlist">{{
              cl.name
            }}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="操作" v-slot="scope">
          <el-link type="primary" @click="HandleEditClick(scope.row)"
            >修改</el-link
          >
        </el-table-column>
      </el-table> -->

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
                <el-table-column prop="id" label="教学班编号">
                </el-table-column>
                <el-table-column prop="name" label="教学班名称">
                </el-table-column>
                <el-table-column label="组成班级" v-slot="scope">
                  <el-tag class="classTag" v-for="cl of scope.row.classList">{{
                    cl.name
                  }}</el-tag>
                </el-table-column>

                <el-table-column label="任课教师" v-slot="scope">
                  <el-tag
                    class="classTag"
                    v-for="teacher of scope.row.teacherList"
                    >{{ teacher.name }}</el-tag
                  >
                </el-table-column>

                <el-table-column label="操作" v-slot="scope" min-width="200px">
                  <div class="RowButtons">
                    <el-link
                      type="primary"
                      @click="HandleTeachingClassEditClick(scope.row)"
                      >编辑</el-link
                    >
                  </div>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>

  <TeacherAssignmentDialog />
</template>

<script>
import { onMounted, ref } from "vue";
import bus from "@/bus/bus";
import { useRoute } from "vue-router";
import { getListTeacherTeachingClassApi } from "@/api/schedule/teacherAssignment.api.js";
import { getListTeachingClassApi } from "@/api/schedule/teachingClass.api";
import TeacherAssignmentDialog from "./TeacherAssignmentDialog.vue";
export default {
  name: "TeacherAssignment",
  components: { TeacherAssignmentDialog },
  setup() {
    const teacherList = ref([]);
    const teachingClassList = ref([]);
    const viewMode = ref(false);
    const taskId = useRoute().query.id;
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

    onMounted(() => {
      getTeacherList()
    });

    const getTeacherList = () => {
      getListTeacherTeachingClassApi(taskId).then(
        (res) => {
          if (res) {
            teacherList.value = res.data;
          }
        },
        (error) => {
          console.log(error);
        }
      );
    };

    const HandleTeacherEditClick = (row) => {
      bus.emit("showTeacherAssignmentDialog", row);
    };

    const HandleViewSwitch = () => {
      viewMode.value = !viewMode.value;
      if (viewMode) {
        currentCourse.value = courseList.value[0].id;
        getTeachingClassList.apply();
      } else {
        getTeacherList()
      }
    };

    //--------------------------------------吾系分割线-----------------------------------------------

    const getTeachingClassList = () => {
      getListTeachingClassApi(taskId, currentCourse.value).then((res) => {
        if (res) {
          if (res.meta.code === 200) {
            currentTeachingClassList.value = res.data;
          }
        }
      });
    };

    const HandleTabChange = () => {
      getTeachingClassList.apply();
    };

    const HandleTeachingClassEditClick = (row) => {
      console.log(row);
      bus.emit("", row, currentCourse.value);
    };

    return {
      teacherList,
      teachingClassList,
      HandleTeachingClassEditClick,
      HandleTeacherEditClick,
      HandleViewSwitch,
      viewMode,

      currentCourse,
      courseList,
      currentTeachingClassList,
      HandleTabChange,
    };
  },
};
</script>


<style scoped>
.teacherAssignmentBody {
  height: 425px;
  display: flex;
  margin: 10px 0px 0px 0px;
  flex-direction: column;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.switchViewButton {
  width: 100px;
  margin: 10px 10px 0px 10px;
}

.teacherViewDiv {
  height: auto;
}
.viewTable {
  height: 370px;
  width: auto;
  margin: 10px;
  padding: 0px 20px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.classTag {
  margin: 5px;
}

.TagDiv {
  display: flex;
  flex-wrap: wrap;
  max-width: 350px;
  max-height: 100px;
}

.setTeachingClassBody {
  height: 370px;
  display: flex;
  margin: 10px;
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
  height: 200px;
  padding: 0px 10px;
  margin: 10px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.classTag {
  margin: 5px;
}
</style>