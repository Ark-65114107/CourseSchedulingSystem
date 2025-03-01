<template>
  <div class="List">
    <div class="buttonMenu">
      <el-button type="primary" @click="HandleAddClick">添加</el-button>
      <el-button type="primary" @click="HandleUploadClick">导入</el-button>
      <el-button type="primary" @click="HandleRefreshClick">刷新</el-button>
      <el-button type="danger" v-show="isDeleteShow" @click="HandleArrayDelete"
        >删除选中</el-button
      >
    </div>

    <el-table
      :data="campuses"
      :row-style="rowStyle"
      @selection-change="HandleSelectChange"
      max-height="450px"
      v-loading="isLoading"
      element-loading-text="正在加载.."
    >
      <el-table-column type="selection" :selectable="selectable" width="55" />
      <el-table-column prop="id" label="id" />
      <el-table-column prop="name" label="校区" />
      <el-table-column label="教学楼" v-slot="scope">
        <div class="RowButtons">
          <el-link type="primary" @click="HandleDrawerClick(scope.row)"
            >教学楼管理</el-link
          >
        </div>
      </el-table-column>
      <el-table-column label="操作" v-slot="scope">
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

    <el-pagination
      @current-change="HandlePageChange"
      @size-change="HandleSizeChange"
      v-model:current-page="pageInfo.page"
      v-model:page-size="pageInfo.size"
      layout=" prev, pager, next,sizes,total"
      :total="locationStore.campusNum"
      :size="pageInfo.size"
      :page-sizes="[5, 10, 20, 50, 100, 200, 300]"
      :default-page-size="5"
      background
    />
  </div>
  <CampusEditDialog />
  <TeachingBuildingListDrawer />
  <CampusUploadDialog />
</template>

<script>
import CampusEditDialog from "./CampusEditDialog.vue";
import TeachingBuildingListDrawer from "../TeachingBuilding/TeachingBuildingListDrawer.vue";
import CampusUploadDialog from "./CampusUploadDialog.vue";

import bus from "@/bus/bus.js";
import { storeToRefs } from "pinia";
import { onMounted, onBeforeMount, reactive, toRefs } from "vue";
import { ElMessageBox } from "element-plus";
import { useLocationStore } from "@/store/locationStore/index.js";
import { ArrayDelete, SingleDelete } from "@/hooks/list/useDelete.js";

export default {
  name: "CampusList",
  components: {
    CampusEditDialog,
    TeachingBuildingListDrawer,
    CampusUploadDialog,
  },
  setup() {
    const locationStore = useLocationStore();
    const { campuses } = storeToRefs(locationStore);

    const data = reactive({
      isDeleteShow: false,
      deleteValue: [],
      isLoading: false,
      pageInfo: {
        page: 1,
        size: 5,
      },
    });

    const HandleSelectChange = (value) => {
      data.deleteValue = value;
      if (value.length === 0) {
        data.isDeleteShow = false;
      } else {
        data.isDeleteShow = true;
      }
    };

    const HandlePageChange = (page) => {
      data.isLoading = true;
      locationStore
        .getCampus({ page, size: data.pageInfo.size })
        .then((res) => {
          if (res === 200) {
            data.isLoading = false;
          }
        });
    };
    const HandleSizeChange = (size) => {
      data.isLoading = true;
      data.pageInfo.page = 1;
      locationStore
        .getCampus({ page: data.pageInfo.page, size })
        .then((res) => {
          if (res === 200) {
            data.isLoading = false;
          }
        });
    };

    const rowStyle = ({ row, rowIndex }) => {
      return {
        height: "60px",
      };
    };

    const HandleAddClick = () => {
      bus.emit("showCampusAdd");
    };

    const HandleEditClick = (value) => {
      bus.emit("showCampusEdit", value);
    };
    const HandleDrawerClick = (value) => {
      bus.emit("showTeachingBuildingListDrawer", value);
    };
    const HandleUploadClick = () => {
      bus.emit("showCampusUploadDialog");
    };
    const HandleRefreshClick = () => {
      data.isLoading = true;
      locationStore
        .refreshCampus({ page: 1, size: data.pageInfo.size })
        .finally(() => {
          data.isLoading = false;
        });
    };

    const HandleArrayDelete = () => {
      ElMessageBox.confirm("确认删除吗?", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          campuses.value = ArrayDelete(campuses.value, data.deleteValue);
        })
        .catch(() => {
          console.log("canceled...");
        });
    };

    const HandleSingleDelete = (value) => {
      ElMessageBox.confirm("确认删除吗?", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          campuses.value = SingleDelete(campuses.value, value);
        })
        .catch(() => {
          console("canceled...");
        });
    };

    return {
      ...toRefs(data),
      campuses,
      HandleArrayDelete,
      HandleSingleDelete,
      HandleSelectChange,
      HandleAddClick,
      HandleEditClick,
      HandleDrawerClick,
      HandleUploadClick,
      rowStyle,
      locationStore,
      HandleRefreshClick,
      HandlePageChange,
      HandleSizeChange,
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

.el-pagination {
  margin: 10px 20px 0px 20px;
}
</style>