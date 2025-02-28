<template>
  <el-dialog
    v-model="isDialogFormVisible"
    :title="mode ? '添加' : '修改'"
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
      ref="campusFormRef"
    >
      <el-form-item label="账户名:" prop="username">
        <el-input
          v-model="formInput.username"
          maxlength="50"
          class="campusName"
          placeholder="请输入账户名"
        />
      </el-form-item>

      <el-form-item label="角色:" prop="roleName">
         <el-select v-model="roleId" placeholder="请选择角色">
          <el-option v-for="role of roles" :key="role.id"/>
         </el-select> 
      </el-form-item>


      <el-form-item label="是否启用:" prop="isEnabled">
        <el-switch v-model="isEnabled"/>
      </el-form-item>

      <el-form-item class="btn">
        <el-button
          type="primary"
          @click="editItem(campusFormRef)"
          v-show="!mode"
        >
          <span>修改</span>
        </el-button>

        <el-button type="primary" @click="addItem(campusFormRef)" v-show="mode">
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
  name: "accountEditDialog",
  mounted() {
    bus.on("showAccountEdit", (value) => {
      this.mode = false;
      this.isDialogFormVisible = true; //List中按下按钮弹窗
      this.$nextTick(() => {
        this.formInput.username = value.username;
        this.formInput.roleId = value.roleId;
        this.formInput.isEnabled = value.isEnabled;
      });
    });

    bus.on("showAccountAdd", () => {
      this.mode = true;
      this.isDialogFormVisible = true; //List中按下按钮弹窗
    });
  },
  setup() {
    const locationStore = useLocationStore();
    const campusFormRef = ref({});
    const data = reactive({
      isDialogFormVisible: false, //是否弹窗
      id: "",
      mode: false,
    });

    const formInput = reactive({
      username: "",
      roleId: "",
      isEnabled: false,
    });

    const inputRule = {
      username: [
        {
          required: true,
          validator: nonEmptyValidator,
          trigger: "blur",
          message: "请输入账户名!",
        },
      ],
      roleId: [
        {
          required: true,
          trigger: "change",
          message: "请选择角色!",
        },
      ],
      isEnabled: [
        {
          required: false,
        },
      ],
    };

    const addItem = (formEl) => {
      if (!formEl) return;
      formEl.validate((validate) => {
        if (validate) {
          locationStore.AddCampus({
            id: uuid(),
            name: formInput.campusName,
            remark: formInput.campusRemark,
            teachingbuildings: [],
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
            locationStore.EditCampus({
              id: data.id,
              name: formInput.campusName,
              remark: formInput.campusRemark,
            })
          ) {
            data.isDialogFormVisible = false; //确认后关闭弹窗
            formEl.resetFields();
          }
        }
      });
    };

    const ClearInput = () => {
      campusFormRef.value.resetFields();
    };

    return {
      ...toRefs(data),
      formInput,
      ClearInput,
      editItem,
      addItem,
      campusFormRef,
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