<template>
  <el-dialog
    v-model="isDialogFormVisible"
    title="修改权限"
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
      <el-form-item class="permissionTreeBack">
        <el-tree
          class="permissionTree"
          :data="formInput.permissions"
          style="max-width: 600px;"
          show-checkbox
        />
      </el-form-item>

      <el-form-item class="btn">
        <el-button type="primary" @click="editItem(campusFormRef)">
          <span>修改</span>
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
import { usePermissionStore } from "@/store/permissionStore/index.js";
import nonEmptyValidator from "@/hooks/validator/useNonEmpty";
export default {
  name: "rolePermissionEditDialog",
  mounted() {
    bus.on("showRolePermissionEdit", (value) => {
      this.mode = false;
      this.isDialogFormVisible = true; //List中按下按钮弹窗
      this.$nextTick(() => {
        this.id = value.id;
        this.formInput.permissions = value.permissions;
        console.log(this.formInput.permissions);
      });
    });
  },
  setup() {
    const campusFormRef = ref({});
    const data = reactive({
      isDialogFormVisible: false, //是否弹窗
      id: "",
    });

    const formInput = reactive({
      permissions: [],
    });

    const inputRule = {
      roleName: [
        {
          required: true,
          validator: nonEmptyValidator,
          trigger: "change",
          message: "请输入角色名称!",
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

<style scoped>
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

.permissionTree {
  background: #f0f2f5;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  flex-direction: column;
  min-width: 100%;
}
.permissionTreeBack {
  background: #f0f2f5;
  border: solid 1px #dcdfe6;
  display: flex;
  justify-content: center;
  padding: 20px;
}

</style>