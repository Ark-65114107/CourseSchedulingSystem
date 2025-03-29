<template>
  <el-dialog
    v-model="isDialogVisiable"
    title= "自动排课"
    width="650px"
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

import { onMounted, reactive, ref, toRefs } from "vue";
import bus from "@/bus/bus";

export default {
  name: "AiScheduleDialog",
  setup() {

    const data = reactive({
      isDialogVisiable: false, //是否弹窗
      id: "",
      mode: false,
    });

    onMounted(()=>{
      bus.on("showAiScheduleDialog", (value) => {
        data.isDialogVisiable = true; //List中按下按钮弹窗
      });
    })

    const HandleCancelClick = ()=>{
      // teachingClassFormRef.value.resetFields();
      data.isDialogVisiable = false;
    }

    return {
      ...toRefs(data),
      HandleCancelClick,
    };
  },
};
</script>

<style>
</style>