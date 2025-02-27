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
      ref="specializationFormRef"
    >
      <el-form-item label="专业方向编号:" prop="specializationCode">
        <el-input
          v-model="formInput.specializationCode"
          maxlength="50"
          class="campusName"
          placeholder="请输入专业方向编号"
        />
      </el-form-item>
      <el-form-item label="专业方向名称:" prop="specializationName">
        <el-input
          v-model="formInput.specializationName"
          maxlength="50"
          class="campusName"
          placeholder="请输入专业方向名称"
        />
      </el-form-item>
      <el-form-item label="年级:" prop="specializationName">
        <el-date-picker type="year" v-model="formInput.grade" />
      </el-form-item>

      <el-form-item label="院系:" prop="facultyId">
        <el-select
          v-model="formInput.facultyId"
          placeholder="请选择院系"
          filterable
          value-key="id"
          @change="
            () => {
              formInput.majorId = '';
            }
          "
        >
          <el-option v-for="f in faculties" :label="f.name" :value="f.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="专业:" prop="majorId">
        <el-select
          v-model="formInput.majorId"
          placeholder="请选择专业"
          filterable
          value-key="id"
        >
          <el-option v-for="m in majorFilter" :label="m.name" :value="m.id" />
        </el-select>
      </el-form-item>

      <el-form-item class="btn">
        <el-button
          type="primary"
          @click="editItem(specializationFormRef)"
          v-show="!mode"
        >
          <span>修改</span>
        </el-button>

        <el-button
          type="primary"
          @click="addItem(specializationFormRef)"
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

import { reactive, ref, toRefs,computed } from "vue";
import { v1 as uuid } from "uuid";
import bus from "@/bus/bus";
import nonEmptyValidator from "@/hooks/validator/useNonEmpty";
import { useAcademicStore } from "@/store/academicStore";
import { storeToRefs } from "pinia";
export default {
  name: "specializationEditDialog",
  mounted() {
    bus.on("showSpecializationEdit", (value) => {
      this.mode = false;
      this.isDialogFormVisible = true; //List中按下按钮弹窗
      this.id = value.id;
      this.$nextTick(() => {
        this.formInput.specializationName = value.name;
        this.formInput.specializationCode = value.code;
        this.formInput.grade = value.grade;
        this.formInput.facultyId = value.facultyId;
        this.formInput.majorId = value.majorId;
      });
    });

    bus.on("showSpecializationAdd", () => {
      this.mode = true;
      this.isDialogFormVisible = true; //List中按下按钮弹窗
    });
  },

  setup() {
    const academicStore = useAcademicStore();
    const { faculties, majors } = storeToRefs(academicStore);
    const specializationFormRef = ref({});
    const data = reactive({
      isDialogFormVisible: false, //是否弹窗
      id: "",
      mode: false,
    });

    const formInput = reactive({
      specializationName: "",
      specializationCode: "",
      grade: "",
      facultyId: "",
      majorId: "",
    });

    const inputRule = {
      specializationName: [
        {
          required: true,
          validator: nonEmptyValidator,
          trigger: "blur",
          message: "请输入专业方向名称!",
        },
      ],
      specializationCode: [
        {
          required: true,
          validator: nonEmptyValidator,
          trigger: "blur",
          message: "请输入专业方向编号!",
        },
      ],
      grade: [
        {
          required: true,
          trigger: "change",
          message: "请输入年级!",
        },
      ],
      facultyId: [
        {
          required: true,
          trigger: "change",
          message: "请选择院系!",
        },
      ],
      majorId: [
        {
          required: true,
          trigger: "change",
          message: "请选择专业!",
        },
      ],
    };

    const addItem = (formEl) => {
      if (!formEl) return;
      formEl.validate((validate) => {
        if (validate) {
          academicStore.AddSpecialization({
            id: uuid(),
            name: formInput.specializationName,
            code: formInput.specializationCode,
            grade: formInput.grade,
            facultyId: formInput.facultyId,
            majorId: formInput.majorId,
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
            academicStore.Editspecialization({
              id: data.id,
              name: formInput.specializationName,
              code: formInput.specializationCode,
              grade: formInput.grade,
              facultyId: formInput.facultyId,
              majorId: formInput.majorId,
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

    const majorFilter = computed(() => {
      return academicStore.getMajorsByfaculty(formInput.facultyId);
    });

    return {
      ...toRefs(data),
      formInput,
      ClearInput,
      editItem,
      addItem,
      specializationFormRef,
      inputRule,
      faculties,
      majors,
      majorFilter,
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