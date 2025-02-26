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
      ref="courseFormRef"
      label-position="right"
      label-width="auto"
      @submit.enter.prevent
    >
      <el-scrollbar height="300px">
        <div>
          <el-form-item label="课程编号:" prop="courseCode">
            <el-input
              class="inputs"
              v-model="formInput.courseCode"
              placeholder="请输入课程编号"
            />
          </el-form-item>

          <el-form-item label="课程名称:" prop="courseName">
            <el-input
              v-model="formInput.courseName"
              class="inputs"
              placeholder="请输入课程名称"
            />
          </el-form-item>
          <el-form-item label="课程英文名:" prop="courseEname">
            <el-input
              v-model="formInput.courseEname"
              class="inputs"
              placeholder="请输入课程英文名"
            />
          </el-form-item>
          <el-form-item label="课程类别" prop="courseCategoryId"
            ><!--下拉框-->
            <el-select
              v-model="formInput.courseCategoryId"
              placeholder="请选择课程类别"
              filterable
              value-key="id"
            >
              <el-option
                v-for="c of academicStore.courseCategories"
                :label="c.name"
                :value="c.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="课程属性" prop="courseAttributeId"
            ><!--下拉框-->
            <el-select
              v-model="formInput.courseAttributeId"
              placeholder="请选择课程属性"
              filterable
              value-key="id"
            >
              <el-option
                v-for="c of academicStore.courseAttributes"
                :label="c.name"
                :value="c.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="课程类型" prop="courseTypeId"
            ><!--下拉框-->
            <el-select
              v-model="formInput.courseTypeId"
              placeholder="请选择课程类型"
              filterable
              value-key="id"
            >
              <el-option
                v-for="c of academicStore.courseTypes"
                :label="c.name"
                :value="c.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="课程性质" prop="courseNatureId"
            ><!--下拉框-->
            <el-select
              v-model="formInput.courseNatureId"
              placeholder="请选择课程性质"
              filterable
              value-key="id"
            >
              <el-option
                v-for="c of academicStore.courseNatures"
                :label="c.name"
                :value="c.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="开课院系" prop="facultyId"
            ><!--下拉框-->
            <el-select
              v-model="formInput.facultyId"
              placeholder="请选择开课院系"
              filterable
              value-key="id"
            >
              <el-option v-for="f of academicStore.faculties" :label="f.name" :value="f.id" />
            </el-select>
          </el-form-item>

          <el-form-item label="是否启用:" prop="isEnabled">
            <el-switch
              v-model="formInput.isEnabled"
              :active-value="true"
              :inactive-value="false"
            />
          </el-form-item>

          <el-form-item label="是否纯实践环节:" prop="isPurelyPractical">
            <el-switch
              v-model="formInput.isPurelyPractical"
              :active-value="true"
              :inactive-value="false"
              @change="
                () => {
                  formInput.theoreticalHours = 0;
                  formInput.laboratoryHours = 0;
                  formInput.computerLabHours = 0;
                  formInput.otherHours = 0;
                }
              "
            />
          </el-form-item>

          <el-form-item label="理论学时:" prop="theoreticalHours">
            <div class="numberInput">
              <el-input-number
                v-model.number="formInput.theoreticalHours"
                max="1000"
                min="0"
                class="inputs"
                placeholder="理论学时"
                controls-position="right"
                :disabled="formInput.isPurelyPractical"
              />
            </div>
          </el-form-item>

          <el-form-item label="实验学时:" prop="laboratoryHours">
            <div class="numberInput">
              <el-input-number
                v-model.number="formInput.laboratoryHours"
                max="1000"
                min="0"
                class="inputs"
                placeholder="实验学时"
                controls-position="right"
                :disabled="formInput.isPurelyPractical"
              />
            </div>
          </el-form-item>

          <el-form-item label="上机学时:" prop="computerLabHours">
            <div class="numberInput">
              <el-input-number
                v-model.number="formInput.computerLabHours"
                max="1000"
                min="0"
                class="inputs"
                placeholder="上机学时"
                controls-position="right"
                :disabled="formInput.isPurelyPractical"
              />
            </div>
          </el-form-item>

          <el-form-item label="实践学时:" prop="practicalHours">
            <div class="numberInput">
              <el-input-number
                v-model.number="formInput.practicalHours"
                max="1000"
                min="0"
                class="inputs"
                placeholder="实践学时"
                controls-position="right"
              />
            </div>
          </el-form-item>

          <el-form-item label="其它学时:" prop="otherHours">
            <div class="numberInput">
              <el-input-number
                v-model.number="formInput.otherHours"
                max="1000"
                min="0"
                class="inputs"
                placeholder="其它学时"
                controls-position="right"
                :disabled="formInput.isPurelyPractical"
              />
            </div>
          </el-form-item>

          <el-form-item label="总学时:">
            <div class="numberInput">
              <el-input-number
                v-model.number="totalClassHours"
                class="inputs"
                placeholder="总学时"
                controls-position="right"
                disabled
              />
            </div>
          </el-form-item>

          <el-form-item label="周学时:" prop="weeklyClassHours">
            <div class="numberInput">
              <el-input-number
                v-model.number="formInput.weeklyClassHours"
                max="1000"
                min="0"
                class="inputs"
                placeholder="周学时"
                controls-position="right"
              />
            </div>
          </el-form-item>

          <el-form-item label="学分" prop="credits">
            <div class="numberInput">
              <el-input-number
                v-model.number="formInput.credits"
                max="15"
                min="0"
                class="inputs"
                placeholder="学分"
                controls-position="right"
                :precision="1"
                :step="0.1"
              />
            </div>
          </el-form-item>
        </div>
      </el-scrollbar>

      <el-form-item class="btn">
        <el-button
          type="primary"
          @click="editItem(courseFormRef)"
          v-show="!mode"
        >
          <span>修改</span>
        </el-button>

        <el-button
          type="primary"
          @click="addItem(courseFormRef)"
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
import { useLocationStore } from "@/store/locationStore/index.js"; //store
import { useAcademicStore } from "@/store/academicStore/index.js"; //store
import nonEmptyValidator from "@/hooks/validator/useNonEmpty";
import { storeToRefs } from "pinia";
export default {
  name: "CourseEditDialog",
  mounted() {
    bus.on("showCourseEdit", (value) => {
      this.mode = false;
      this.isDialogFormVisible = true; //List中按下按钮弹窗
      this.$nextTick(() => {
        this.id = value.id;
        this.courseCode = value.code;
        this.courseName = value.name;
        this.courseEname = value.ename;
        this.courseCategoryId = value.courseCategoryId;
        this.courseAttributeId = value.courseAttributeId;
        this.courseTypeId = value.courseTypeId;
        this.courseNatureId = value.courseNatureId;
        this.facultyId = value.facultyId;
        this.isEnabled = value.isEnabled;
        this.theoreticalHours = value.theoreticalHours;
        this.laboratoryHours = value.laboratoryHours;
        this.computerLabHours = value.computerLabHours;
        this.practicalHours = value.practicalHours;
        this.otherHours = value.otherHours;
        this.weeklyClassHours = value.weeklyClassHours;
        this.credits = value.credits;
        this.isPurelyPractical = value.isPurelyPractical;
      });
    });

    bus.on("showCourseAdd", () => {
      this.mode = true;
      this.isDialogFormVisible = true; //List中按下按钮弹窗
    });
  },
  setup() {
    const locationStore = useLocationStore();
    const academicStore = useAcademicStore();
    const { campuses, classroomtypes, teachingbuildings } =  storeToRefs(locationStore);
    const { departments } = storeToRefs(academicStore);

    const courseFormRef = ref({});

    const data = reactive({
      isDialogFormVisible: false, //是否弹窗
      id: "",
      mode: false,
      activeName: "basic",
    });

    const formInput = reactive({
      courseCode: "",
      courseName: "",
      courseEname: "",
      courseCategoryId: "",
      courseAttributeId: "",
      courseTypeId: "",
      courseNatureId: "",
      facultyId: "",
      isEnabled: true,
      theoreticalHours: "",
      laboratoryHours: "",
      computerLabHours: "",
      practicalHours: "",
      otherHours: "",
      weeklyClassHours: "",
      credits: "",
      isPurelyPractical: false,
    });

    const totalClassHours = computed(() => {
      return formInput.theoreticalHours +
        formInput.laboratoryHours +
        formInput.computerLabHours +
        formInput.practicalHours +
        formInput.otherHours
      ;
    });

    const filtedArray = reactive({
      filtedTeachingBuildingOptions: computed(() => {
        return locationStore.getBuildingsByCampus(formInput.classroomCampusId);
      }),
    });

    const inputRule = {
      courseCode: [
        {
          required: true,
          trigger: "blur",
          validator: nonEmptyValidator,
          message: "请输入课程编号!",
        },
      ],
      courseName: [
        {
          required: true,
          validator: nonEmptyValidator,
          trigger: "blur",
          message: "请输入课程名称!",
        },
      ],
      courseEname: [
        {
          required: false,
        },
      ],
      courseCategoryId: [
        {
          required: true,
          validator: nonEmptyValidator,
          trigger: "change",
          message: "请选择课程类别!",
        },
      ],
      courseAttributeId: [
        {
          required: true,
          validator: nonEmptyValidator,
          trigger: "change",
          message: "请选择课程属性!",
        },
      ],
      courseTypeId: [
        {
          required: true,
          validator: nonEmptyValidator,
          trigger: "change",
          message: "请选择课程类型!",
        },
      ],
      courseNatureId: [
        {
          required: true,
          validator: nonEmptyValidator,
          trigger: "change",
          message: "请选择课程属性!",
        },
      ],
      facultyId: [
        {
          required: true,
          trigger: "change",
          message: "请选择开课院系!",
        },
      ],
      isEnabled: [
        {
          required: false,
        },
      ],
      theoreticalHours: [
        { required: true, trigger: "change", message: "请输入理论学时!" },
      ],
      laboratoryHours: [
        {
          required: true,
          trigger: "change",
          message: "请输入实验学时!",
        },
      ],
      computerLabHours: [
        {
          required: true,
          trigger: "change",
          message: "请输入上机学时!",
        },
      ],
      practicalHours: [
        {
          required: true,
          trigger: "change",
          message: "请输入实践学时!",
        },
      ],
      otherHours: [
        {
          required: true,
          trigger: "change",
          message: "请输入其它学时!",
        },
      ],
      weeklyClassHours: [
        {
          required: true,
          trigger: "change",
          message: "请输入周学时!",
        },
      ],
      credits: [
        {
          required: true,
          trigger: "change",
          message: "请输入学分!",
        },
      ],
      isPurelyPractical: [
        {
          required: false,
        },
      ],
    };

    const addItem = (formEl) => {
      if (!formEl) return;
      formEl.validate((validate) => {
        if (validate) {
          academicStore.AddCourse({
            id: uuid(),
            code: formInput.courseCode,
            name: formInput.courseName,
            ename: formInput.courseEname,
            courseCategoryId: formInput.courseCategoryId,
            courseAttributeId: formInput.courseAttributeId,
            courseTypeId: formInput.courseTypeId,
            courseNatureId: formInput.courseNatureId,
            facultyId: formInput.facultyId,
            isEnabled: formInput.isEnabled,
            totalClassHours: totalClassHours,
            theoreticalHours: formInput.theoreticalHours,
            laboratoryHours: formInput.laboratoryHours,
            computerLabHours: formInput.computerLabHours,
            practicalHours: formInput.practicalHours,
            otherHours: formInput.otherHours,
            weeklyClassHours: formInput.weeklyClassHours,
            credits: formInput.credits,
            isPurelyPractical: formInput.isPurelyPractical,
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
            academicStore.EditCourse({
              id: data.id,
              code: formInput.courseCode,
              name: formInput.courseName,
              ename: formInput.courseEname,
              courseCategoryId: formInput.courseCategoryId,
              courseAttributeId: formInput.courseAttributeId,
              courseTypeId: formInput.courseTypeId,
              courseNatureId: formInput.courseNatureId,
              facultyId: formInput.facultyId,
              isEnabled: formInput.isEnabled,
              totalClassHours:totalClassHours,
              theoreticalHours: formInput.theoreticalHours,
              laboratoryHours: formInput.laboratoryHours,
              computerLabHours: formInput.computerLabHours,
              practicalHours: formInput.practicalHours,
              otherHours: formInput.otherHours,
              weeklyClassHours: formInput.weeklyClassHours,
              credits: formInput.credits,
              isPurelyPractical: formInput.isPurelyPractical,
            })
          ) {
            data.isDialogFormVisible = false; //确认后关闭弹窗
            formEl.resetFields();
          }
        }
      });
    };

    const ClearInput = () => {
      courseFormRef.value.resetFields();
    };

    return {
      ...toRefs(data),
      ...toRefs(formInput),
      formInput,
      totalClassHours,
      ClearInput,
      editItem,
      addItem,
      campuses,
      courseFormRef,
      inputRule,
      filtedArray,
      classroomtypes,
      departments,
      academicStore
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