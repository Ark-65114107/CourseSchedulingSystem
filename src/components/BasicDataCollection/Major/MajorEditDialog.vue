<template>
  <el-dialog
    v-model="isDialogFormVisible"
    :title="mode ? '添加' : '修改'"
    width="30%"
    class="dialog"
    :close-on-click-modal="false"
    :show-close="false"
    @close="ClearInput"
  >
    <el-form
      class="form"
      :model="formInput"
      :rules="inputRule"
      ref="majorFormRef"
      label-position="right"
      label-width="auto"
      @submit.enter.prevent
    >
            <el-form-item label="专业编号:" prop="id">
              <el-input
                class="inputs"
                v-model="id"
                placeholder="请输入专业编号"
              />
            </el-form-item>

            <el-form-item label="专业名称:" prop="majorName">
              <el-input
                v-model="majorName"
                class="inputs"
                placeholder="请输入专业名称"
              />
            </el-form-item>
            <el-form-item label="英文名" prop="majorEname"
              ><!--下拉框-->
              <el-input
                v-model="majorEname"
                class="inputs"
                placeholder="请输入英文名"
              />
            </el-form-item>
            <el-form-item label="简称" prop="majorAbbr"
              ><!--下拉框-->
              <el-input
                v-model="majorAbbr"
                class="inputs"
                placeholder="请输入简称"
              />
            </el-form-item>

            <el-form-item label="学制" prop="majorDuration">
              <el-input-number v-model="majorDuration" controls-position="right">
                <template #suffix>
                  年
                </template>
              </el-input-number>
            </el-form-item>

             <el-form-item label="培养层次" prop="educationalLevel"
              ><!--下拉框-->
              <el-select
                v-model="educationalLevel"
                placeholder="请选择培养层次"
                filterable
              >
                <el-option
                  v-for="e of educationalLevels"
                  :label="e"
                  :value="e"
                />
              </el-select>
            </el-form-item>

             <el-form-item label="所属院系" prop="facultyId"
              ><!--下拉框-->
              <el-select
                v-model="facultyId"
                placeholder="请选择所属院系"
                filterable
                value-key="id"
              >
                <el-option
                  v-for="f of faculties"
                  :label="f.name"
                  :value="f.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item prop="isEnabled">
              <el-checkbox v-model="isEnabled" label="是否开办"/>
            </el-form-item>

      <el-form-item class="btn">
        <el-button
          type="primary"
          @click="editItem(majorFormRef)"
          v-show="!mode"
        >
          <span>修改</span>
        </el-button>

        <el-button
          type="primary"
          @click="addItem(majorFormRef)"
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
import bus from "@/bus/bus";
import { useAcademicStore } from "@/store/academicStore/index.js"; //store
import {} from "@/data/academic.js";
import nonEmptyValidator from "@/hooks/validator/useNonEmpty";
import { storeToRefs } from "pinia";
export default {
  name: "ClassroomEditDialog",
  mounted() {
    bus.on("showMajorEdit", (value) => {
      this.mode = false;
      this.isDialogFormVisible = true; //List中按下按钮弹窗
      this.$nextTick(() => {
        this.id = value.id;
        this.majorName = value.name;
        this.majorAbbr = value.abbr;
        this.majorEname = value.ename;
        this.majorDuration = value.duration;
        this.isEnabled = value.isEnabled;
        this.facultyId = value.facultyId;
        this.educationalLevel = value.educationalLevel;
      });
    });

    bus.on("showMajorAdd", () => {
      this.mode = true;
      this.isDialogFormVisible = true; //List中按下按钮弹窗
    });
  },
  setup() {
    const academicStore = useAcademicStore();
    const { faculties,educationalLevels} = storeToRefs(academicStore);
    const majorFormRef = ref({});

    const data = reactive({
      isDialogFormVisible: false, //是否弹窗
      mode: false,
      activeName: "basic",
    });

    const formInput = reactive({
      id: "",
      majorName: "",
      majorAbbr: "",
      majorEname: "",
      majorDuration: "",
      isEnabled: "",
      facultyId: "",
      educationalLevel: "",
    });

    const inputRule = {
      id: [
        {
          required: true,
          validator: nonEmptyValidator,
          trigger: "blur",
          message: "请输入专业编号!",
        },
      ],
      majorName: [
        {
          required: true,
          validator: nonEmptyValidator,
          trigger: "blur",
          message: "请输入专业名称!",
        },
      ],
      majorAbbr: [
        {
          required: false,
        },
      ],
      majorEname: [
        {
          required: false,
        },
      ],
      majorDuration: [
        {
          required: true,
          trigger: "change",
          message: "请输入学制!",
        },
      ],
      isEnabled: [
        {
          required: false,
        },
      ],
      facultyId: [
        {
          required: true,
          validator: nonEmptyValidator,
          trigger: "change",
          message: "请选择院系!",
        },
      ],
      educationalLevel: [
        {
          required: true,
          validator: nonEmptyValidator,
          trigger: "change",
          message: "请选择培养层次!",
        },
      ],
    };

    const addItem = (formEl) => {
      if (!formEl) return;
      formEl.validate((validate) => {
        if (validate) {
          academicStore.AddMajor({
            id: formInput.id,
            name: formInput.majorName,
            abbr: formInput.majorAbbr,
            ename: formInput.majorEname,
            duration: formInput.majorDuration,
            isEnabled: formInput.isEnabled,
            facultyId: formInput.facultyId,
            educationalLevel: formInput.educationalLevel,
          });
          data.isDialogFormVisible = false; //确认后关闭弹窗
          formEl.resetFields();
        }
      });
    };

    const editItem = (formEl) => {
      if (!formEl) return;
      formEl.validate((validate) => {
        console.log(validate);
        if (validate) {
          if (
            academicStore.EditMajor({
              id: formInput.id,
              name: formInput.majorName,
              abbr: formInput.majorAbbr,
              ename: formInput.majorEname,
              duration: formInput.majorDuration,
              isEnabled: formInput.isEnabled,
              facultyId: formInput.facultyId,
              educationalLevel: formInput.educationalLevel,
            })
          ) {
            data.isDialogFormVisible = false; //确认后关闭弹窗
            formEl.resetFields();
          }
        }
      });
    };

    const ClearInput = () => {
      majorFormRef.value.resetFields();
    };

    return {
      ...toRefs(data),
      ...toRefs(formInput),
      formInput,
      ClearInput,
      editItem,
      addItem,
      majorFormRef,
      inputRule,
      faculties,
      educationalLevels
    };
  },
};
</script>

<style>
.dialog .el-dialog__body {
  max-height: 30%;
}

.form {
  margin: 20px;
  display: flex;
  flex-direction: column;
}

.inputs,
.remark,
.el-select {
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
.checkboxGroup {
  display: inline-flex;
}

.el-checkbox {
  margin-left: 10px;
}
</style>