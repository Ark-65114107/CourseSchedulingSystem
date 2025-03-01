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
      ref="departmentFormRef"
      @submit.enter.prevent
    >
      <el-form-item label="部门代码:" prop="departmentCode">
        <el-input
          v-model="formInput.departmentCode"
          maxlength="50"
          class="inputs"
          placeholder="请输入部门代码"
        />
      </el-form-item>

      <el-form-item label="部门名称:" prop="departmentName">
        <el-input
          v-model="formInput.departmentName"
          maxlength="50"
          class="inputs"
          placeholder="请输入部门名称"
        />
      </el-form-item>
      <el-form-item label="部门英文名:" prop="departmentEnglishName">
        <el-input
          v-model="formInput.departmentEnglishName"
          maxlength="80"
          class="inputs"
          placeholder="请输入部门英文名"
        />
      </el-form-item>
      <el-form-item label="部门简称:" prop="departmentAbbr">
        <el-input
          v-model="formInput.departmentAbbr"
          maxlength="50"
          class="inputs"
          placeholder="请输入部门简称"
        />
      </el-form-item>

      <el-form-item label="部门类型" prop="departmentType"
        ><!--下拉框-->
        <el-select
          v-model="formInput.departmentType"
          placeholder="请选择部门类型"
          filterable
          value-key="id"
        >
          <el-option
            v-for="type of departmentTypes"
            :label="type.name"
            :value="type"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="固定教学楼" prop="teachingbuildingId"
        ><!--下拉框-->
        <el-select
          v-model="formInput.teachingbuildingId"
          placeholder="请选择教学楼"
          filterable
          value-key="id"
        >
          <el-option value="" label="无" />
          <el-option
            v-for="building of teachingbuildings"
            :label="building.name"
            :value="building.id"
          />
        </el-select>
      </el-form-item>
      <div class="checkboxGroup">
        <el-form-item prop="isEntity">
          <el-checkbox label="是否为实体" v-model="formInput.isEntity" />
        </el-form-item>
        <el-form-item prop="isEnabled">
          <el-checkbox label="是否启用" v-model="formInput.isEnabled" />
        </el-form-item>

        <el-form-item prop="isCourseOffering">
          <el-checkbox
            label="是否为开课院系"
            v-model="formInput.isCourseOffering"
          />
        </el-form-item>

        <el-form-item prop="isTeaching">
          <el-checkbox label="是否为上课院系" v-model="formInput.isTeaching" />
        </el-form-item>

        <el-form-item prop="isTeachingResearchOffice">
          <el-checkbox
            label="是否开课教研室"
            v-model="formInput.isTeachingResearchOffice"
          />
        </el-form-item>
      </div>

      <el-form-item class="btn">
        <el-button
          type="primary"
          @click="editItem(departmentFormRef)"
          v-show="!mode"
        >
          <span>修改</span>
        </el-button>

        <el-button
          type="primary"
          @click="addItem(departmentFormRef)"
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
import { useAcademicStore } from "@/store/academicStore/index.js";
import { useLocationStore } from "@/store/locationStore/index.js";
import nonEmptyValidator from "@/hooks/validator/useNonEmpty";
import { storeToRefs } from "pinia";

export default {
  name: "DepartmentEditDialog",
  mounted() {
    bus.on("showDepartmentEdit", (value) => {
      this.id = value.id;
      this.mode = false;
      this.isDialogFormVisible = true; //List中按下按钮弹窗
      this.$nextTick(() => {
        (this.formInput.departmentName = value.name),
          (this.formInput.departmentEnglishName = value.ename),
          (this.formInput.departmentAbbr = value.abbr),
          (this.formInput.departmentCode = value.code),
          (this.formInput.departmentType = value.type),
          (this.formInput.teachingbuildingId = value.teachingbuildingId),
          (this.formInput.isEntity = value.isEntity),
          (this.formInput.isCourseOffering = value.isCourseOffering),
          (this.formInput.isTeaching = value.isTeaching),
          (this.formInput.isEnabled = value.isEnabled),
          (this.formInput.isTeachingResearchOffice =
            value.isTeachingResearchOffice);
      });
    });

    bus.on("showDepartmentAdd", () => {
      this.mode = true;
      this.isDialogFormVisible = true; //List中按下按钮弹窗
    });
  },

  setup() {
    const academicStore = useAcademicStore();
    const locationStore = useLocationStore();
    const { departmentTypes } = storeToRefs(academicStore);
    const { teachingbuildings } = storeToRefs(locationStore);
    const departmentFormRef = ref({});
    const data = reactive({
      isDialogFormVisible: false, //是否弹窗
      id: "",
      mode: false,
    });

    const formInput = reactive({
      departmentName: "",
      departmentEnglishName: "",
      departmentAbbr: "",
      departmentCode: "",
      departmentType: "",
      teachingbuildingId: "",
      teachingbuildingName: "",
      isEntity: true,
      isCourseOffering: false,
      isTeaching: true,
      isEnabled: true,
      isTeachingResearchOffice: false,
    });

    const inputRule = {
      departmentName: [
        {
          required: true,
          validator: nonEmptyValidator,
          trigger: "blur",
          message: "请输入部门名称!",
        },
      ],
      departmentCode: [
        {
          required: true,
          validator: nonEmptyValidator,
          trigger: "blur",
          message: "请输入部门代码!",
        },
      ],
      departmentType: [
        { required: true, trigger: "change", message: "请选择部门类型!" },
      ],
      departmentName: [
        {
          required: true,
          validator: nonEmptyValidator,
          trigger: "blur",
          message: "请输入部门名称!",
        },
      ],
      isEntity: [
        {
          required: false,
        },
      ],
      isTeaching: [
        {
          required: false,
        },
      ],
      isCourseOffering: [
        {
          required: false,
        },
      ],
      isEnabled: [
        {
          required: false,
        },
      ],
      isTeachingResearchOffice: [
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
          academicStore.AddDepartment({
            id: uuid(),
            name: formInput.departmentName,
            ename: formInput.departmentEnglishName,
            abbr: formInput.departmentAbbr,
            code: formInput.departmentCode,
            type: formInput.departmentType,
            teachingbuildingId: formInput.teachingbuildingId,
            teachingbuildingName: locationStore.teachingbuildingNameMap.get(
              formInput.teachingbuildingId
            ),
            isEntity: formInput.isEntity,
            isCourseOffering: formInput.isCourseOffering,
            isTeaching: formInput.isTeaching,
            isEnabled: formInput.isEnabled,
            isTeachingResearchOffice: formInput.isTeachingResearchOffice,
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
            academicStore.EditDepartment({
              id: data.id,
              name: formInput.departmentName,
              ename: formInput.departmentEnglishName,
              abbr: formInput.departmentAbbr,
              code: formInput.departmentCode,
              type: formInput.departmentType,
              teachingbuildingId: formInput.teachingbuildingId,
              teachingbuildingName: locationStore.teachingbuildingNameMap.get(
                formInput.teachingbuildingId
              ),
              isEntity: formInput.isEntity,
              isCourseOffering: formInput.isCourseOffering,
              isTeaching: formInput.isTeaching,
              isEnabled: formInput.isEnabled,
              isTeachingResearchOffice: formInput.isTeachingResearchOffice,
            })
          ) {
            data.isDialogFormVisible = false; //确认后关闭弹窗
            formEl.resetFields();
          }
        }
      });
    };

    const ClearInput = () => {
      departmentFormRef.value.resetFields();
    };

    return {
      ...toRefs(data),
      formInput,
      editItem,
      addItem,
      ClearInput,
      departmentFormRef,
      inputRule,
      departmentTypes,
      teachingbuildings,
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

.checkboxGroup {
  display: flex;
  flex-wrap: wrap;
}

.el-checkbox {
  margin-left: 10px;
}
</style>