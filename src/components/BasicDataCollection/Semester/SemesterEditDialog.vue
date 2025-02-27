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
      ref="semesterFormRef"
      label-position="right"
      label-width="auto"
      @submit.enter.prevent
    >
      <el-form-item label="学期名称:">
        <el-input class="inputs" v-model="formInput.semesterName" disabled />
      </el-form-item>

      <el-form-item label="学年" prop="academicYear"
        ><!--下拉框-->
        <el-select
          v-model="formInput.academicYear"
          placeholder="请选择学年"
          filterable
          value-key="id"
          @change="()=>{
            formInput.startAndEndDates = []
          }"
        >
          <el-option
            v-for="c of academicStore.academicYears"
            :label="`${c}学年`"
            :value="c"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="学期" prop="semester"
        ><!--下拉框-->
        <el-select
          v-model="formInput.semester"
          placeholder="请选择学期"
          filterable
          value-key="id"
        >
          <el-option v-for="c of 4" :label="`第${c}学期`" :value="c" />
        </el-select>
      </el-form-item>

      <el-form-item label="起止日期:" prop="startAndEndDates">
        <el-date-picker
          v-model="formInput.startAndEndDates"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item class="btn">
        <el-button
          type="primary"
          @click="editItem(semesterFormRef)"
          v-show="!mode"
        >
          <span>修改</span>
        </el-button>

        <el-button
          type="primary"
          @click="addItem(semesterFormRef)"
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

import { computed, reactive, ref, toRefs } from "vue";
import { v1 as uuid } from "uuid";
import bus from "@/bus/bus";
import { useAcademicStore } from "@/store/academicStore/index.js"; //store
export default {
  name: "semesterEditDialog",
  mounted() {
    bus.on("showSemesterEdit", (value) => {
      this.mode = false;
      this.isDialogFormVisible = true; //List中按下按钮弹窗
      this.$nextTick(() => {
        this.id = value.id;
        this.formInput.academicYear = value.academicYear;
        this.formInput.startAndEndDates = value.startAndEndDates;
        this.formInput.semester = value.semester;
      });
    });

    bus.on("showSemesterAdd", () => {
      this.mode = true;
      this.isDialogFormVisible = true; //List中按下按钮弹窗
    });
  },
  setup() {
    const academicStore = useAcademicStore();
    const semesterFormRef = ref({});

    const data = reactive({
      isDialogFormVisible: false, //是否弹窗
      id: "",
      mode: false,
      activeName: "basic",
    });

    const formInput = reactive({
      semesterName: computed(() => {
        if (formInput.academicYear && formInput.semester) {
          return `${formInput.academicYear}-${formInput.semester}`;
        } else {
          return "";
        }
      }),
      academicYear: "",
      semester: "",
      startAndEndDates: [],
    });

    const inputRule = {
      academicYear: [
        {
          required: true,
          trigger: "change",
          message: "请选择学年!",
        },
      ],
      semester: [
        {
          required: true,
          trigger: "change",
          message: "请选择学期!",
        },
      ],
      startAndEndDates: [
        {
          required: true,
          trigger: "change",
          message: "请选择起止日期!",
        },
        {
          type: "array",
          trigger: "change",
          validator: (rule, value, callback) => {
            console.log(value);
            if (formInput.academicYear) {
              if (
                value[0].split("-")[0] > formInput.academicYear.split("-")[0] ||
                value[0].split("-")[1] > formInput.academicYear.split("-")[1]
              ) {
                callback(new Error("起止日期应在学年范围之内!"));
              } else {
                callback();
              }
            }
            callback()
            
          },
        },
      ],
    };

    const addItem = (formEl) => {
      if (!formEl) return;
      formEl.validate((validate) => {
        if (validate) {
          academicStore.AddSemester({
            id: uuid(),
            name: formInput.semesterName,
            academicYear: formInput.academicYear,
            semester: formInput.semester,
            startAndEndDates: formInput.startAndEndDates,
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
            academicStore.EditSemester({
              id: data.id,
              name: formInput.semesterName,
              academicYear: formInput.academicYear,
              semester: formInput.semester,
              startAndEndDates: formInput.startAndEndDates,
            })
          ) {
            data.isDialogFormVisible = false; //确认后关闭弹窗
            formEl.resetFields();
          }
        }
      });
    };

    const ClearInput = () => {
      semesterFormRef.value.resetFields();
    };

    return {
      ...toRefs(data),
      ...toRefs(formInput),
      formInput,
      ClearInput,
      editItem,
      addItem,
      semesterFormRef,
      inputRule,
      academicStore,
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