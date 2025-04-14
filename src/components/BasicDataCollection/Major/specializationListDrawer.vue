<template>
  <el-drawer
    v-model="isDrawerVisible"
    title="专业方向管理"
    direction="rtl"
    size="55%"
  >
    <div class="List">
      <div class="buttonMenu">
        <el-button type="primary" @click="HandleAddClick">添加</el-button>
        <el-button
          type="danger"
          v-show="isDeleteShow"
          @click="HandleArrayDelete(deleteValue)"
          >删除选中</el-button
        >
      </div>
      <el-table
        :data="filtedArray"
        :row-style="rowStyle"
        @selection-change="HandleSelectChange"
      >
        <el-table-column type="selection" :selectable="selectable" width="55" />
        <el-table-column prop="code" label="专业方向编号" width="100" />
        <el-table-column prop="name" label="专业方向名称" width="80" />
        <el-table-column prop="grade" label="年级" width="70" />
        <el-table-column
          prop="facultyId"
          :formatter="facultyFormatter"
          label="院系"
          width="120"
        />
        <el-table-column
          prop="majorId"
          label="专业编号"
          width="120"
        />
        <el-table-column
          prop="majorId"
          :formatter="majorNameFormatter"
          label="专业名称  "
          width="120"
        />

        <el-table-column label="操作" v-slot="scope" min-width="144px" fixed="right">
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
  </el-drawer>
  <specializationEditDialog/>
</template>

<script>
import bus from "@/bus/bus.js";
import { storeToRefs } from "pinia";
import { computed, reactive, toRefs } from "vue";
import { ElMessageBox } from "element-plus";
import { ArrayDelete, SingleDelete } from "@/hooks/list/useDelete.js";
import specializationEditDialog from "./specializationEditDialog.vue";
import { useAcademicStore } from "@/store/academicStore";
export default {
  name: "specializationListDrawer",
  components: {
    specializationEditDialog,
  },
  mounted() {
    bus.on("showSpecializationListDrawer", (value) => {
      this.majorId = value.id
      this.isDrawerVisible = true; //打开抽屉
    });
  },

  setup() {
    const academicStore = useAcademicStore();
    const { specializations } = storeToRefs(academicStore);

    const data = reactive({
      isDeleteShow: false,
      isDrawerVisible: false,
      deleteValue: [],
      majorId:""
    });

    const filtedArray = computed(()=>{
      return academicStore.specializations.filter((s)=>{
        return s.majorId == data.majorId
      })
    })

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
      bus.emit("showSpecializationAdd");
    };

    const HandleEditClick = (value) => {
      bus.emit("showSpecializationEdit", value);
    };

    const HandleArrayDelete = () => {
      ElMessageBox.confirm("确认删除吗?", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          types.value = ArrayDelete(types.value, data.deleteValue);
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
          types.value = SingleDelete(types.value, value);
        })
        .catch(() => {
          console("canceled...");
        });
    };

    const isAvailable = (row) => {
      return row.isAvailable ? "是" : "否";
    };

    const facultyFormatter = (row) => {
      return academicStore.departmentNameMap.get(row.facultyId);
    };
    const majorCodeFormatter = (row) => {
      console.log(academicStore.majorMap.get(row.majorId));
      return academicStore.majorMap.get(row.majorId).id;
    };
    const majorNameFormatter = (row) => {
      return academicStore.majorNameMap.get(row.majorId);
    };

    return {
      ...toRefs(data),
      HandleArrayDelete,
      HandleSingleDelete,
      HandleSelectChange,
      HandleAddClick,
      HandleEditClick,
      rowStyle,
      isAvailable,
      specializations,
      facultyFormatter,
      majorCodeFormatter,
      majorNameFormatter,
      filtedArray
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
}

tbody td .cell .RowButtons {
  display: flex;
  flex-wrap: nowrap;
}
.el-table {
  border: solid 2px #f0f2f5;
}
.addLink {
  width: auto;
  margin: 5px 0px;
  text-align: center;
}
</style>