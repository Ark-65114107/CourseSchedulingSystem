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
        <el-autocomplete
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
        >
      </el-form-item>
      <el-scrollbar class="teachingClassScrollBar" always ref="scrollBarRef">
        <div class="nodata" v-if="isTeachingClassListEmpty">
          <el-text type="info">暂无数据</el-text>
        </div>
        <el-tag
          class="teacherClassTag"
          closable
          @close="HandleTagClose(teachingClass)"
          v-else
          v-for="teachingClass of formInput.teacherList"
          >{{ teachingClass.name }} # {{teachingClass.id}}</el-tag
        >
      </el-scrollbar>
    </el-form>
    <template #footer>
      <el-button @click="HandleCancel">取消</el-button>
      <el-button
        type="primary"
        @click="HandleClose(TeacherAssignmentFormRef)"
        :loading="false"
        >确定</el-button
      >
    </template>
  </el-dialog>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import bus from "@/bus/bus";
import { useRoute } from "vue-router";
import nonEmptyValidator from "@/hooks/validator/useNonEmpty";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getSingleTeachingClassApi,
  updateTeachingClassApi,
} from "@/api/schedule/setTeachingClass/teachingClass.api";
import {
  getSingleTeacherTeachingClassApi,
  searchTeachingClassApi,
} from "@/api/schedule/teacherAssignment/teacherAssignment.api";

export default {
  name: "TeacherAssignmentTeachingClassDialog",
  setup() {
    const taskId = useRoute().query.id;
    const teacherKeyword = ref("");
    const selectedTeachingClass = ref("");
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
      bus.on("showTeacherAssignmentTeachingClassDialog", (row) => {
        currentTeachingClass.value = row;
        getSingleTeachingClassApi(taskId, row.id).then((res) => {
          if (res) {
            if (res.meta.code === 200) {
              formInput.value.teacherList = res.data;
            }
          }
        });
        isDialogVisiable.value = true;
      });
    });

    const HandleClose = (ref) => {
      console.log(ref);
      isDialogVisiable.value = false;
    };

    const HandleCancel = () => {
      isDialogVisiable.value = false;
    };

    const HandleTagClose = (item) => {
      formInput.value.teacherList =
        formInput.value.teacherList.filter((tag) => {
          return tag != item;
        });
    };

    const getTeacherSuggestions = (keyword, callback) => {
      searchTeacherApi(taskId, keyword).then((res) => {
        callback(res.data.map((c) => ({ ...c, value: `${c.name}` })));
      });
    };

    const HandleSuggestionSelected = (value) => {
      selectedTeachingClass.value = value;
    };

    const HandleSuggestionClear = () => {
      selectedTeachingClass.value = "";
    };

    const HandleTeachingClassAdd = () => {
      if (
        !formInput.value.teacherList.includes(selectedTeachingClass.value)
      ) {
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
      getTeacherSuggestions,
      teacherKeyword,
      HandleSuggestionSelected,
      HandleTeachingClassAdd,
      HandleSuggestionClear,
      isTeachingClassListEmpty,
      HandleTagClose,
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
</style>