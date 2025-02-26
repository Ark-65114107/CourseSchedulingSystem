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
    <el-form
      class="form"
      :model="formInput"
      label-position="right"
      label-width="auto"
      :rules="inputRule"
      ref="teacherFormRef"
      @submit.enter.prevent
    >
      <el-form-item label="工号:" prop="teacherId">
        <el-input
          v-model="formInput.teacherId"
          maxlength="50"
          class="inputs"
          placeholder="请输入工号"
        />
      </el-form-item>

      <el-form-item label="教师姓名:" prop="teacherName">
        <el-input
          v-model="formInput.teacherName"
          maxlength="50"
          class="inputs"
          placeholder="请输入教师姓名"
        />
      </el-form-item>
      <el-form-item label="英文名:" prop="teacherEname">
        <el-input
          v-model="formInput.teacherEname"
          maxlength="50"
          class="inputs"
          placeholder="请输入英文名"
        />
      </el-form-item>

      <el-form-item label="性别:" prop="teacherGender">
        <el-radio-group v-model="formInput.teacherGender">
          <el-radio value="1">男</el-radio>
          <el-radio value="0">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="部门:" prop="teacherDepartmentId">
        <el-select
          v-model="formInput.teacherDepartmentId"
          value-key="id"
          placeholder="请选择部门"
          filterable
        >
          <el-option
            v-for="obj of departments"
            :label="obj.name"
            :value="obj.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="职称:" prop="teacherTitleId">
        <el-select
          v-model="formInput.teacherTitleId"
          value-key="id"
          placeholder="请选择职称"
          filterable
        >
          <el-option v-for="obj of titles" :label="obj.name" :value="obj.id" />
        </el-select>
      </el-form-item>

      <el-form-item prop="isExternal">
        <el-checkbox label="是否外聘" v-model="formInput.isExternal" />
      </el-form-item>

      <el-form-item class="btn">
        <el-button
          type="primary"
          @click="editItem(teacherFormRef)"
          v-show="!mode"
        >
          <span>修改</span>
        </el-button>

        <el-button
          type="primary"
          @click="addItem(teacherFormRef)"
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
import { usePersonnelStore } from "@/store/personnelStore/index.js";
import { useAcademicStore } from "@/store/academicStore/index.js";
import nonEmptyValidator from "@/hooks/validator/useNonEmpty";
import { storeToRefs } from "pinia";

export default {
  name: "TeacherEditDialog",
  mounted() {
    bus.on("showTeacherEdit", (value) => {
      this.mode = false;
      this.isDialogFormVisible = true; //List中按下按钮弹窗
      this.$nextTick(() => {
        this.id = value.id;
        this.formInput.teacherEname = value.ename;
        this.formInput.teacherName = value.name;
        this.formInput.teacherId = value.teacherId;
        this.formInput.teacherGender = value.gender;
        this.formInput.teacherEthnicityId = value.ethnicityId;
        this.formInput.teachertitleId = value.titleId;
        this.formInput.teacherDepartmentId = value.departmentId;
        this.formInput.isExternal = value.isExternal;
        this.formInput.facultyTypeId = value.facultyTypeId;
      });
    });

    bus.on("showTeacherAdd", () => {
      this.mode = true;
      this.isDialogFormVisible = true; //List中按下按钮弹窗
    });
  },
  setup() {
    const personnelStore = usePersonnelStore();
    const academicStore = useAcademicStore();
    const { departments } = storeToRefs(academicStore)
    const teacherFormRef = ref({});
    const data = reactive({
      isDialogFormVisible: false, //是否弹窗
      id: "",
      mode: false,
    });

    const formInput = reactive({
      teacherId: "",
      teacherName: "",
      teacherGender: "2", //teachersex鈦璂鈀鎤了,所以换成gender了
      teacherEname: "",
      teacherDepartmentId: "",
      teacherEthnicityId: "",
      teachertitleId: "",
      isExternal: false,
      facultyTypeId: "",
    });

    const inputRule = {

      teacherId: [
        {
          required: true,
          validator: nonEmptyValidator,
          message: "请输入教师工号!",
          trigger: "blur",
        },
      ],
      teacherName: [
        {
          required: true,
          validator: nonEmptyValidator,
          message: "请输入教师姓名!",
          trigger: "blur",
        },
      ],
      teacherGender: [
        {
          required: false,
        },
      ],
      teacherEname: [
        {
          required: false,
        },
      ],
      teacherDepartmentId: [
        {
          required: true,
          validator: nonEmptyValidator,
          message: "请选择教师所属部门!",
          trigger: "change",
        },
      ],
      teacherEthnicityId: [
        {
          required: false,
        },
      ],
      teachertitleId: [
        {
          required: false,
        },
      ],
      isExternal: [
        {
          required: false,
        },
      ],
      facultyTypeId: [
        {
          required: false,
        },
      ],
    };

    const addItem = (formEl) => {
      console.log(formEl);
      if (!formEl) return;
      formEl.validate((validate) => {
        if (validate) {
          personnelStore.AddTeacher({
            id: uuid(),
            teacherId: "1",
            name: formInput.teacherName,
            gender: formInput.teacherGender, //男1女0未设置2
            ename: formInput.teacherEname,
            ethnicityId: formInput.teacherEthnicityId,
            titleName: formInput.teachertitleId,
            departmentName: personnelStore.teacherNameMap.get(
              formInput.teacherDepartmentId
            ),
            departmentId: formInput.teacherDepartmentId,
            isExternal: formInput.isExternal,
            facultyTypeId: formInput.facultyTypeId,
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
            personnelStore.EditTeacher({
              id: data.id,
              teacherId: "1",
              name: formInput.teacherName,
              gender: formInput.teacherGender, //男1女0未设置2
              ename: formInput.teacherEname,
              ethnicityId: formInput.teacherEthnicityId,
              titleName: formInput.teachertitleId,
              departmentName: personnelStore.teacherNameMap.get(
                formInput.teacherDepartmentId
              ),
              departmentId: formInput.teacherDepartmentId,
              isExternal: formInput.isExternal,
              facultyTypeId: formInput.facultyTypeId,
            })
          ) {
            data.isDialogFormVisible = false; //确认后关闭弹窗
            formEl.resetFields();
          }
        }
      });
    };

    const ClearInput = () => {
      teacherFormRef.value.resetFields();
    };

    return {
      ...toRefs(data),
      formInput,
      editItem,
      addItem,
      ClearInput,
      teacherFormRef,
      inputRule,
      departments,
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