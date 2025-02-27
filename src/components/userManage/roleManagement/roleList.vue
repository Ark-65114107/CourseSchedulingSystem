<template>
  <div class="List">
    <div class="buttonMenu">
      <el-button type="primary" @click="HandleAddClick">添加</el-button>
      <el-button type="danger" v-show="isDeleteShow" @click="HandleArrayDelete"
        >删除选中</el-button
      >
    </div>

    <el-table
      :data="permissionStore.roles"
      :row-style="rowStyle"
      @selection-change="HandleSelectChange"
      height="400"
    >
      <el-table-column type="selection" :selectable="selectable" width="40" />
      <el-table-column prop="name" label="角色名称" min-width="155px" />

      <el-table-column
        label="角色权限"
        v-slot="scope"
        min-width="220px"
        fixed="right"
      >
        <div class="RowButtons">
          <el-button type="primary" @click="HandlePermissionClick(scope.row)"
            >修改权限</el-button
          >
        </div>
      </el-table-column>

      <el-table-column
        label="操作"
        v-slot="scope"
        min-width="220px"
        fixed="right"
      >
        <div class="RowButtons">
          <el-button type="primary" @click="HandleEditClick(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" @click="HandleSingleDelete(scope.row)"
            >删除</el-button
          >
        </div>
      </el-table-column>
    </el-table>
  </div>
  <roleEditDialog />
  <rolePermissionEditDialog/>
</template>

<script>
import bus from "@/bus/bus.js";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, onMounted, reactive, toRefs } from "vue";
import { ElMessageBox, imageProps } from "element-plus";
import { ArrayDelete, SingleDelete } from "@/hooks/list/useDelete.js";
import { usePermissionStore } from "@/store/permissionStore/index.js";
import roleEditDialog from "./roleEditDialog.vue";
import rolePermissionEditDialog from './rolePermissionEditDialog.vue';


export default {
  name: "ClassroomList",
  components: {
    roleEditDialog,
    rolePermissionEditDialog
  },
  setup() {
    const permissionStore = usePermissionStore();

    const data = reactive({
      isDeleteShow: false,
      deleteValue: [],
    });

    onMounted(() => {
      permissionStore.initRoles();
    });

    const HandleSelectChange = (value) => {
      data.deleteValue = value;
      if (value.length === 0) {
        data.isDeleteShow = false;
      } else {
        data.isDeleteShow = true;
      }
    };

    const rowStyle = ({ row, rowIndex }) => {
      return {
        height: "60px",
      };
    };

    const HandleAddClick = () => {
      bus.emit("showRoleAdd");
    };

    const HandleEditClick = (value) => {
      bus.emit("showRoleEdit", value);
    };
    const HandlePermissionClick = (value) => {
      bus.emit("showRolePermissionEdit", value);
    };


    const HandleArrayDelete = () => {
      ElMessageBox.confirm("确认删除吗?", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          classrooms.value = ArrayDelete(classrooms.value, data.deleteValue);
        })
        .catch(() => {
          console("canceled...");
        });
    };

    const HandleSingleDelete = (value) => {
      ElMessageBox.confirm("确认删除吗?", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          classrooms.value = SingleDelete(classrooms.value, value);
        })
        .catch(() => {
          console.log("canceled...");
        });
    };

    return {
      ...toRefs(data),
      HandleArrayDelete,
      HandleSingleDelete,
      HandleSelectChange,
      HandleAddClick,
      HandleEditClick,
      rowStyle,
      permissionStore,
      HandlePermissionClick
    };
  },
};
</script>

<style scoped>
.List {
  background: white;
  padding: 10px;
  margin: 10px;
  border: solid 2px #f0f2f5;
}

.buttonMenu {
  display: flex;
  justify-content: flex-start;
  margin: 0px 0px 10px 0px;
  flex-wrap: nowrap;
}

tbody td .cell .RowButtons {
  display: flex;
  flex-wrap: nowrap;
}

.el-table {
  border: solid 2px #f0f2f5;
}

.el-table-column {
  min-width: 200px;
}
.filterSelector {
  width: 260px;
  margin-left: 10px;
}

.filters {
  display: inline-flex;
  flex-direction: row;
  margin: 10px 0px 10px 0px;
}

.filterLabel {
  margin-left: 20px;
}
</style>