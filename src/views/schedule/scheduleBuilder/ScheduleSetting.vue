
  <template>
  <div class="scheduleSettingBody">
    <div class="settingMenu">
      <div class="menuTitle">
        <span>课表作息</span>
      </div>
      <el-scrollbar height="345px">
        <el-form label-position="right" label-width="auto">
          <div class="formItemTitle">
            <el-text>时长设置</el-text>
          </div>
          <el-form-item class="formItem" label="课程时长：">
            <el-input-number class="" controls-position="right">
              <template #suffix>分钟</template>
            </el-input-number>
          </el-form-item>
          <el-form-item class="formItem" label="课间时长：">
            <el-input-number class="" controls-position="right">
              <template #suffix>分钟</template>
            </el-input-number>
          </el-form-item>

          <div class="formItemTitle">
            <el-text>节次设置</el-text>
          </div>
          <el-form-item label="早自习节次：">
            <el-input-number controls-position="right"> </el-input-number>
          </el-form-item>
          <el-form-item label="上午节次：">
            <el-input-number controls-position="right"> </el-input-number>
          </el-form-item>
          <el-form-item label="下午节次：">
            <el-input-number controls-position="right"> </el-input-number>
          </el-form-item>
          <el-form-item label="晚上节次：">
            <el-input-number controls-position="right"> </el-input-number>
          </el-form-item>
          <el-form-item label="晚自习节次：">
            <el-input-number controls-position="right"> </el-input-number>
          </el-form-item>

          <div class="formItemTitle">
            <el-text>课程时间设置</el-text>
          </div>
          <el-form-item class="formItem" label="午休时间：">
            <el-input-number class="" controls-position="right">
              <template #suffix>分钟</template>
            </el-input-number>
          </el-form-item>
          <el-form-item class="formItem" label="晚休时间：">
            <el-input-number class="" controls-position="right">
              <template #suffix>分钟</template>
            </el-input-number>
          </el-form-item>

          <div class="formItemTitle">
            <el-text>课程时间设置</el-text>
          </div>
        </el-form>
      </el-scrollbar>
    </div>
    <div class="scheduleTableDiv"></div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import bus from "@/bus/bus";
import { getListTeachingClassApi } from "@/api/schedule/teachingClass.api";
import { useRoute } from "vue-router";
export default {
  name: "ScheduleSetting",
  components: {},
  setup() {
    return {};
  },
};
</script>


<style scoped>
.scheduleSettingBody {
  height: 425px;
  display: flex;
  margin: 10px 0px 0px 0px;
  flex-direction: row;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.settingMenu {
  width: 25%;
  margin: 10px;
  padding: 10px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.scheduleTableDiv {
  width: 75%;
  margin: 10px 10px 10px 0px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
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
</style>