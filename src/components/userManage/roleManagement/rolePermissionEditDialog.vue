<template>
  <el-dialog
    v-model="isDialogFormVisible"
    title="修改权限"
    width="450"
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
        <el-scrollbar >
            <el-tree
              class="permissionTree"
              :data="formInput.permissions"
              style="max-width: 600px"
              @check-change="handleCheckChange"
              show-checkbox
            />
        </el-scrollbar>
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
import { useUserManageStore } from '@/store/userManageStore';
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
    const userManageStore = useUserManageStore()
    const campusFormRef = ref({});
    const data = reactive({
      isDialogFormVisible: false, //是否弹窗
      id: "",
    });

    const formInput = reactive({
      permissions: [],
    });

    const handleCheckChange = (data, bool, i) => {
      console.log(data, bool, i);
    };

    const addItem = (formEl) => {
      if (!formEl) return;
      formEl.validate((validate) => {
        if (validate) {
          userManageStore.AddRole({
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
            userManageStore.EditRole({
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
      handleCheckChange,
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
  flex-direction: column;
  height: 100%;
}

.permissionTreeBack {
  background: #f0f2f5;
  border: solid 1px #dcdfe6;
  display: flex;
  padding: 20px;
  margin: 10px;
  height:360px;
}

.el-scrollbar{
  width: 100%;
  
}
</style>