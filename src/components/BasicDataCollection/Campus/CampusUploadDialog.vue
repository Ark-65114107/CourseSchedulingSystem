<template>
  <el-dialog
    v-model="isDialogFormVisible"
    title="导入"
    width="450"
    class="dialog"
  >
    <el-text type="danger"> * 在这里导入教学楼以及校区信息! </el-text>
    <br />
    <el-text type="danger"> 格式为excel,具体见下图 </el-text>
    <el-image />
    <el-upload drag action="" :on-change="test" :http-request="nothing">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">拖动文件到这里! 或者<em>点我上传!</em></div>
      <template #tip>
        <div class="el-upload__tip">文件大小不超过2MB</div>
      </template>
    </el-upload>
  </el-dialog>
</template>

<script>

import { reactive, ref, toRefs } from "vue";
import bus from "@/bus/bus";
import * as xlsx from 'xlsx'

export default {
  name: "CampusUploadDialog",
  mounted() {
    bus.on("showCampusUploadDialog", () => {
      this.isDialogFormVisible = true; //List中按下按钮弹窗
    });
  },
  setup() {
    const data = reactive({
      isDialogFormVisible: false, //是否弹窗
    });

    const nothing = (data)=>{

    }

    const test = function(f){
        const data = f.raw
        const reader = new FileReader()
        reader.readAsBinaryString(data)
        reader.onload = (fe)=>{
          const res = xlsx.read(fe.target.result,{type:"binary"})
          console.log(xlsx.utils.sheet_to_json(res.Sheets[res.SheetNames[0]]));
        }
    }

    return {
      ...toRefs(data),
      test,
      nothing
    };
  },
};
</script>

<style>
.form {
  margin: 20px;
}

.inputs,
.remark {
  max-width: 300px;
}

.btn .el-form-item__content {
  display: flex;
  justify-content: right;
}
.numberInput {
  display: inline-flex;
  flex-direction: column;
}
</style>