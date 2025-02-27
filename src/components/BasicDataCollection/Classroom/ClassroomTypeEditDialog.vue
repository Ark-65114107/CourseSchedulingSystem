<template>
  <el-dialog
    v-model="isDialogFormVisible"
    title="修改教室类型"
    width="450"
    class="dialog"
    :close-on-click-modal="false"
    :show-close="false"
    @close="ClearInput"
  >
    <el-form
      class="campusform"
      :model="formInput"
      :rules="inputRule"
      label-position="right"
      label-width="auto"
      ref="classroomTypeFormRef"
    >
      <el-form-item label="教室类型名称:" prop="typeName">
        <el-input
          v-model="formInput.typeName"
          maxlength="50"
          class="campusName"
        />
      </el-form-item>

      <el-form-item class="btn">
        <el-button
          type="primary"
          @click="editItem(classroomTypeFormRef)"
          v-show="!mode"
        >
          <span>修改</span>
        </el-button>

        <el-button
          type="primary"
          @click="addItem(classroomTypeFormRef)"
          v-show="mode"
        >
          <span>添加</span>
        </el-button>

        <el-button @click="isDialogFormVisible = false">
          <span>取消</span>
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

import { reactive, ref, toRefs } from "vue";
import { v1 as uuid } from "uuid";
import bus from "@/bus/bus";
import { useLocationStore } from "@/store/locationStore/index.js";
import nonEmptyValidator from "@/hooks/validator/useNonEmpty";
export default {
  name: "ClassroomTypeEditDialog",
  mounted() {
    bus.on("showClassroomTypeEdit", (value) => {
      this.mode = false;
      this.isDialogFormVisible = true; //List中按下按钮弹窗
      this.id = value.id;
      this.$nextTick(() => {
        this.formInput.typeName = value.name;
      });
    });

    bus.on("showClassroomTypeAdd", () => {
      this.mode = true;
      this.isDialogFormVisible = true; //List中按下按钮弹窗
    });
  },
  setup() {
    const locationStore = useLocationStore();
    const classroomTypeFormRef = ref({});
    const data = reactive({
      isDialogFormVisible: false, //是否弹窗
      id: "",
      mode: false,
    });

    const formInput = reactive({
      typeName: "",
    });

    const inputRule = {
      typeName: [
        {
          required: true,
          validator: nonEmptyValidator,
          trigger: "blur",
          message: "请输入教室类型名称!",
        },
      ],
    };

    const addItem = (formEl) => {
      if (!formEl) return;
      formEl.validate((validate) => {
        if (validate) {
          locationStore.AddType({
            id: uuid(),
            name: formInput.typeName,
          });
          data.isDialogFormVisible = false; //确认后关闭弹窗
          formEl.resetFields();
        }
      });
    };

    const editItem = (formEl) => {
      if (!formEl) return;
      formEl.validate((validate) => {
        if (validate) {
          if (
            locationStore.EditType({
              id: data.id,
              name: formInput.typeName,
            })
          ) {
            data.isDialogFormVisible = false; //确认后关闭弹窗
            formEl.resetFields();
          }
        }
      });
    };

    const ClearInput = () => {
      classroomTypeFormRef.value.resetFields();
    };

    return {
      ...toRefs(data),
      formInput,
      ClearInput,
      editItem,
      addItem,
      classroomTypeFormRef,
      inputRule,
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