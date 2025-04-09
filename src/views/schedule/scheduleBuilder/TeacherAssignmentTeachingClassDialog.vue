<template>
  <el-dialog
    v-model="isDialogVisiable"
    title="修改教学班教师"
    width="500px"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <el-form
      label-position="right"
      label-width="auto"
      style="margin: 20px"
      :model="formInput"
      ref="TeacherAssignmentFormRef"
    >
      <el-form-item>
        <el-text>{{ currentTeachingClass.name }}</el-text>
      </el-form-item>
      <el-form-item class="addTeachingClassFormItem">
        <!-- <el-autocomplete
          class="searchInput"
          clearable
          v-model="teacherKeyword"
          placeholder="搜索教师"
          :fetch-suggestions="getTeacherSuggestions"
          @select="HandleSuggestionSelected"
          @clear="HandleSuggestionClear"
        >
        </el-autocomplete>
        <el-button
          class="addButton"
          type="primary"
          @click="HandleTeachingClassAdd"
          >添加</el-button
        > -->

        <el-select
          filterable
          remote
          :remote-method="HandleRemoteSelect"
          v-model="selectedTeacher"
          @change="HandleSelectChange"
          :loading="isOptionLoading"
        >
          <div
            class="optionContainer"
            v-infinite-scroll="loadTeacher"
            :infinite-scroll-delay="800"
            :infinite-scroll-immediate="false"
            style="overflow: hide"
          >
            <el-option
              v-for="teacher of teacherOptions"
              :value="teacher"
              :label="teacher.name"
              :key="teacher.id"
            />
            <el-option v-show="isOptionLoading" label="加载中..." disabled />
          </div>
        </el-select>
      </el-form-item>
      <el-scrollbar class="teachingClassScrollBar" always ref="scrollBarRef">
        <div class="nodata" v-if="isTeachingClassListEmpty">
          <el-text type="info">暂无数据</el-text>
        </div>
        <el-tag
          class="teacherClassTag"
          closable
          @close="HandleTagClose(teacher)"
          v-else
          v-for="teacher of formInput.teacherList"
          >{{ teacher.name }}</el-tag
        >
      </el-scrollbar>
    </el-form>
    <template #footer>
      <el-button @click="HandleCancel">取消</el-button>
      <el-button
        type="primary"
        @click="HandleClose(TeacherAssignmentFormRef)"
        :loading="isButtonLoading"
        >确定</el-button
      >
    </template>
  </el-dialog>
</template>

<script>
import { computed, onMounted, reactive, ref, watch } from "vue";
import bus from "@/bus/bus";
import { useRoute } from "vue-router";
import nonEmptyValidator from "@/hooks/validator/useNonEmpty";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getSingleTeachingClassApi,
  updateTeachingClassApi,
} from "@/api/schedule/setTeachingClass/teachingClass.api";
import {
  updateTeachingClassTeacherApi,
} from "@/api/schedule/teacherAssignment/teacherAssignment.api";
import { getTeacherListApi } from "@/api/basicData/teacher.api";

export default {
  name: "TeacherAssignmentTeachingClassDialog",
  setup() {
    const taskId = useRoute().query.id;
    const teacherKeyword = ref("");
    const selectedTeachingClass = ref("");
    const selectedTeacher = ref("");
    const teacherOptions = ref([]);
    const pageInfo = reactive({
      page: 1,
      size: 10,
    });
    const total = ref(0);
    const isOptionLoading = ref(false);
    const isButtonLoading = ref(false);

    const isDialogVisiable = ref(false);
    const currentTeachingClass = ref("");
    const TeacherAssignmentFormRef = ref();
    const scrollBarRef = ref();
    const formInput = ref({
      teacherList: [],
    });

    const isTeachingClassListEmpty = computed(() => {
      return formInput.value.teacherList.length == 0;
    });

    onMounted(() => {
      clearForm();
      bus.on("showTeacherAssignmentTeachingClassDialog", (row) => {
        currentTeachingClass.value = row;
        getTeachingClassTeacherList();
        getTeacherList();
        isDialogVisiable.value = true;
      });
    });

    const clearForm = () => {
      pageInfo.page = 1;
      pageInfo.size = 10;
      total.value = 0;
      isButtonLoading.value = false;
      selectedTeacher.value = "";
      formInput.value.teacherList = [];
      teacherOptions.value = [];
    };

    const HandleRemoteSelect = (keyword) => {
      pageInfo.page = 1;
      pageInfo.size = 10;
      total.value = 0;
      teacherOptions.value = [];
      teacherKeyword.value = keyword
      getTeacherList(teacherKeyword.value);
    };

    const loadTeacher = () => {
      console.log("load!");
      pageInfo.page++;
      if (teacherKeyword.value) {
        if (pageInfo.page * pageInfo.size < total.value) {
          isOptionLoading.value = true;
          getTeacherList(teacherKeyword.value);
        }
      } else {
        if (pageInfo.page * pageInfo.size < total.value) {
          isOptionLoading.value = true;
          getTeacherList();
        }
      }
    };

    const getTeachingClassTeacherList = () => {
      getSingleTeachingClassApi(taskId, currentTeachingClass.value.id).then(
        (res) => {
          if (res) {
            if (res.meta.code === 200) {
              formInput.value.teacherList = res.data.teacherList;
            }
          }
        }
      );
    };

    const updateTeachingClassTeacher = () => {
      isButtonLoading.value = true;
      return updateTeachingClassTeacherApi()
        .then((res) => {
          if (res) {
            if (res.code === 200) {
              isButtonLoading.value = false;
              return 200;
            }
          }
        })
        .finally(() => {
          isButtonLoading.value = false;
        });
    };

    const HandleClose = (ref) => {
      clearForm();
      updateTeachingClassTeacher().then((res) => {
        if (res == 200) {
          isDialogVisiable.value = false;
        }
      });
    };

    const HandleCancel = () => {
      clearForm();
      isDialogVisiable.value = false;
    };

    const HandleTagClose = (item) => {
      formInput.value.teacherList = formInput.value.teacherList.filter(
        (tag) => {
          return tag.id != item.id;
        }
      );
    };

    const getTeacherList = (keyword) => {
      getTeacherListApi({
        page: pageInfo.page,
        size: pageInfo.size,
        keyword,
      }).then((res) => {
        if (res) {
          if (res.meta.code === 200) {
            console.log(res);
            teacherOptions.value = [
              ...teacherOptions.value,
              ...res.data.teachers,
            ];
            total.value = res.data.total;
            isOptionLoading.value = false;
          }
        }
      });
    };

    const HandleSuggestionSelected = (value) => {
      selectedTeachingClass.value = value;
    };

    const HandleSelectChange = () => {
      if (formInput.value.teacherList.includes(selectedTeacher.value)) {
        ElMessage("请勿重复添加!");
      } else {
        formInput.value.teacherList.push(selectedTeacher.value);
        selectedTeacher.value = "";
      }
    };

    const HandleSuggestionClear = () => {
      selectedTeachingClass.value = "";
    };

    const HandleTeachingClassAdd = () => {
      if (!formInput.value.teacherList.includes(selectedTeachingClass.value)) {
        formInput.value.teacherList.push(selectedTeachingClass.value);
        selectedTeachingClass.value = "";
        teacherKeyword.value = "";
      }
    };

    return {
      formInput,
      isDialogVisiable,
      HandleClose,
      HandleCancel,
      currentTeachingClass,
      TeacherAssignmentFormRef,
      teacherKeyword,
      HandleSuggestionSelected,
      HandleTeachingClassAdd,
      HandleSuggestionClear,
      isTeachingClassListEmpty,
      HandleTagClose,
      selectedTeacher,
      teacherOptions,
      total,
      pageInfo,
      loadTeacher,
      isOptionLoading,
      HandleRemoteSelect,
      HandleSelectChange,
      isButtonLoading,
    };
  },
};
</script>

<style >
.dialogBody {
  display: flex;
  justify-content: center;
}

.addTeachingClassFormItem {
  display: flex;
  flex-direction: row;
  height: 50px;
  width: auto;
}

.searchInput {
  width: 358px;
}

.nodata {
  height: 100%;
  width: 100%;
  margin: auto;
  display: flex;
  justify-content: center;
}

.addButton {
  margin: 10px 0px 10px 10px;
}

.teachingClassScrollBar {
  width: auto;
  height: 200px;
  padding: 5px;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}

.teacherClassTag {
  margin: 5px;
}

.optionContainer {
  min-height: 300px;
  background: white;
}
</style>