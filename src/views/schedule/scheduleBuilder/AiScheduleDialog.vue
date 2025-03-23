<template>
  <el-dialog
    v-model="isDialogFormVisible"
    :title= 'mode ? "添加":"修改"'
    width="450"
    class="dialog"
    :close-on-click-modal="false"
    :show-close="false"
    @close="ClearInput"
  >
   <template #footer>
    <el-button @click="HandleCancelClick">取消</el-button>
    <el-button @click="HandleCancelClick">确认</el-button>
   </template>
  </el-dialog>
</template>

<script>

import { reactive, ref, toRefs } from "vue";
import bus from "@/bus/bus";

export default {
  name: "AiScheduleDialog",
  mounted() {
    bus.on("showAiScheduleDialog", (value) => {
      this.isDialogFormVisible = true; //List中按下按钮弹窗
    });
  },

  setup() {

    const data = reactive({
      isDialogFormVisible: false, //是否弹窗
      id: "",
      mode: false,
    });

    return {
      ...toRefs(data),
    };
  },
};
</script>

<style>
</style>