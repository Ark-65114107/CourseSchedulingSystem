<template>
  <el-dialog
    v-model="isDialogVisiable"
    title="修改教师任课"
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
      <el-form-item label="教师姓名：">
        <el-text>{{ currentTeacher.name }}</el-text>
      </el-form-item>
      <el-form-item class="addTeachingClassFormItem">
        <!-- <el-autocomplete
          class="searchInput"
          clearable
          v-model="teachingClassKeyword"
          placeholder="搜索教学班"
          :fetch-suggestions="getTeachingClassSuggestions"
          @select="HandleSuggestionSelected"
          @clear="HandleSuggestionClear"
        >
        </el-autocomplete> -->
        <el-select
          filterable
          remote
          :remote-method="HandleRemoteSelect"
          v-model="selectedTeachingClass"
          @change="HandleTeachingClassAdd"
          @visible-change="HandleDropDown"
          :loading="isOptionLoading"
        >
          <div
            v-infinite-scroll="loadTeachingClass"
            :infinite-scroll-delay="1000"
            :infinite-scroll-immediate="false"
            style="overflow: hide"
          >
            <el-option
              v-for="teachingClass of teachingClassOptions"
              :value="teachingClass"
              :label="teachingClass.name"
              :key="teachingClass.id"
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
          class="teachingClassTag"
          closable
          @close="HandleTagClose(teachingClass)"
          v-else
          v-for="teachingClass of formInput.teachingClassList"
          >{{ teachingClass.name }} # {{ teachingClass.id }}</el-tag
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
import { computed, onMounted, ref, watch, reactive } from "vue";
import bus from "@/bus/bus";
import { useRoute } from "vue-router";
import nonEmptyValidator from "@/hooks/validator/useNonEmpty";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getSingleTeacherTeachingClassApi,
  searchTeachingClassApi,
} from "@/api/schedule/teacherAssignment/teacherAssignment.api";

export default {
  name: "TeacherAssignmentDialog",
  setup() {
    const taskId = useRoute().query.id;
    const teachingClassKeyword = ref("");
    const selectedTeachingClass = ref("");
    const isDialogVisiable = ref(false);
    const currentTeacher = ref("");
    const TeacherAssignmentFormRef = ref();
    const scrollBarRef = ref();
    const teachingClassOptions = ref([]);
    const formInput = ref({
      teachingClassList: [],
    });

    const pageInfo = reactive({
      page: 1,
      size: 10,
    });
    const total = ref(0);
    const isOptionLoading = ref(false);
    const isButtonLoading = ref(false);

    const isTeachingClassListEmpty = computed(() => {
      return formInput.value.teachingClassList.length == 0;
    });

    onMounted(() => {
      bus.on("showTeacherAssignmentDialog", (row) => {
        currentTeacher.value = row;
        getSingleTeacherTeachingClassApi(taskId, row.id).then((res) => {
          if (res) {
            if (res.meta.code === 200) {
              console.log(res);
              formInput.value.teachingClassList = res.data.classlist;
            }
          }
        });
        isDialogVisiable.value = true;
      });
    });

    const HandleClose = (ref) => {
      console.log(ref);
      clearForm();
      isDialogVisiable.value = false;
    };

    const HandleCancel = () => {
      clearForm();
      isDialogVisiable.value = false;
    };

    const HandleTagClose = (item) => {
      formInput.value.teachingClassList =
        formInput.value.teachingClassList.filter((tag) => {
          return tag != item;
        });
    };

    const getTeachingClassSuggestions = (keyword, callback) => {
      searchTeachingClassApi(taskId, keyword).then((res) => {
        callback(res.data.map((c) => ({ ...c, value: `${c.name}#${c.id}` })));
      });
    };

    const HandleSuggestionClear = () => {
      selectedTeachingClass.value = "";
    };

    const HandleTeachingClassAdd = () => {
      if (
        !formInput.value.teachingClassList.includes(selectedTeachingClass.value)
      ) {
        formInput.value.teachingClassList.push(selectedTeachingClass.value);
        selectedTeachingClass.value = "";
        teachingClassKeyword.value = "";
      } else {
        ElMessage("教学班已存在!");
      }
    };

    const clearForm = () => {
      teachingClassKeyword.value = "";
      selectedTeachingClass.value = "";
      currentTeacher.value = "";
      formInput.value.teachingClassList = [];
    };

    const getTeachingClassList = () => {
      if (teachingClassKeyword.value) {
        searchTeachingClassApi(
          taskId,
          pageInfo.page,
          pageInfo.size,
          teachingClassKeyword.value
        ).then((res) => {
          if (res) {
            if (res.meta.code == 200) {
              total.value = res.data.total;
              teachingClassOptions.value = [
                ...teachingClassOptions.value,
                ...res.data.data,
              ];
            }
          }
        });
      }
    };

    const HandleDropDown = () => {
      if (teachingClassKeyword.value) {
        pageInfo.page = 1;
        total.value = 0;
        teachingClassOptions.value = [];
        getTeachingClassList();
      }
    };

    const loadTeachingClass = () => {
      if (teachingClassKeyword.value) {
        pageInfo.page++;
        if (pageInfo.page * pageInfo.size < total.value) {
          isOptionLoading.value = true;
          getTeachingClassList();
        }
      }
    };

    const HandleRemoteSelect = (keyword) => {
      pageInfo.page = 1;
      total.value = 0;
      teachingClassOptions.value = [];
      teachingClassKeyword.value = keyword;
      getTeachingClassList();
    };

    return {
      formInput,
      isDialogVisiable,
      HandleClose,
      HandleCancel,
      currentTeacher,
      TeacherAssignmentFormRef,
      getTeachingClassSuggestions,
      teachingClassKeyword,
      HandleTeachingClassAdd,
      HandleSuggestionClear,
      isTeachingClassListEmpty,
      HandleTagClose,
      loadTeachingClass,
      teachingClassOptions,
      HandleDropDown,
      HandleRemoteSelect,
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

.teachingClassTag {
  margin: 5px;
}
</style>