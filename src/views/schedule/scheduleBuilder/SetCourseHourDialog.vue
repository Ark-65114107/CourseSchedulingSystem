<template>
  <el-dialog v-model="isDialogVisiable" title="统一设置学时" width="350px">
    <div class="dialogBody">
      <el-form>
        <el-form-item label="学时:">
          <el-input-number
            v-model="courseHour"
            controls-position="right"
            style="width: 150px"
          ></el-input-number>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button type="primary" @click="HandleClose">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, ref } from "vue";
import bus from "@/bus/bus";
import { batchUpdateCourseHour } from '@/api/schedule/courseHour.api';
export default {
  name: "SetCourseHourDialog",
  setup() {
    const isDialogVisiable = ref(false);
    const courseHour = ref(0);
    onMounted(() => {
      bus.on(
        "showSetCourseHourDialog",
        (taskId, courseId, courseHour) => {
          //在这里发请求修改课程下所有班级的学时，然后刷新
          batchUpdateCourseHour(taskId,courseId,courseHour).then(res=>{
            //记得添加刷新动画!!!!
            console.log(res);
          })
          isDialogVisiable.value = true;
        }
      );
    });


    const HandleClose = ()=>{
      isDialogVisiable.value = false
    }

    return {
      isDialogVisiable,
      courseHour,
      HandleClose
    };
  },
};
</script>

<style scoped>
.dialogBody {
  display: flex;
  justify-content: center;
}
</style>