
  <template>
  <div class="setCourseClassBody">
    <el-tabs class="courseTab" v-model="currentCourse" type="border-card">
      <el-tab-pane class="courseTabPane" label="qwq">
        <div class="courseTabPaneBody">
          <el-tabs class="classTab" type="card">
            <el-tab-pane label="awa"> </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "SetCourseClass",
  setup() {
    const currentCourse = ref("");

    return {
      currentCourse,
    };
  },
};
</script>


<style scoped>
.setCourseClassBody {
  height: 360px;
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

.courseTabPaneBody{
  border: solid 1px #dcdfe6;

}
</style>