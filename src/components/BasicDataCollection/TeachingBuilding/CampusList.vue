<template>
  <div class="List">
    <div class="buttonMenu">
      <el-button type="primary" @click="HandleAddClick">添加</el-button>
      <el-button type="primary" @click="HandleUploadClick">导入</el-button>
      <el-button
        type="primary"
        @click="HandleRefreshClick"
        :loading="refreshLoading"
        >刷新</el-button
      >
      <el-button type="danger" v-show="isDeleteShow" @click="HandleArrayDelete"
        >删除选中</el-button
      >
      <el-input
        class="searchInput"
        v-model="keyWordTemp"
        :prefix-icon="Search"
        @clear="HandleClear"
        clearable
      />
      <el-button @click="HandleSearchClick">搜索</el-button>
    </div>

    <el-table
      :data="teachingClasses"
      :row-style="rowStyle"
      @selection-change="HandleSelectChange"
      max-height="400px"
      height="400px"
      v-loading="isLoading"
      element-loading-text="正在加载..."
      ref="tableRef"
    >
      <el-table-column type="selection" :selectable="selectable" width="55" />
      <el-table-column prop="id" label="教学楼编号" />
      <el-table-column prop="name" label="教学楼名称" />
      <el-table-column prop="campusName" label="校区名称" />
      <el-table-column prop="isEnabled" label="可用状态" />
      <el-table-column label="教学楼" v-slot="scope">
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
      layout=" prev, pager, next,sizes,jumper,total"
      :total="locationStore.teachingbuildingNum"
      :size="pageInfo.size"
      :page-sizes="[5, 10, 20, 50, 100, 200, 300]"
      :default-page-size="5"
      background
    />
  </div>
  <CampusEditDialog />

</template>

<script>
import TeachingBuildingEditDialog from "./TeachingBuildingEditDialog.vue";

import bus from "@/bus/bus.js";
import { storeToRefs } from "pinia";
import { onMounted, ref, reactive, toRefs } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useLocationStore } from "@/store/locationStore/index.js";
import { ArrayDelete, SingleDelete } from "@/hooks/list/useDelete.js";
import { Search } from "@element-plus/icons-vue";

export default {
  name: "TeachingBuildingList",
  components: {
    TeachingBuildingEditDialog,
  },
  setup() {
    const locationStore = useLocationStore();
    const { teachingbuildings } = storeToRefs(locationStore);
    const tableRef = ref();
    
    const data = reactive({
      isDeleteShow: false,
      deleteValue: [],
      isLoading: false,
      refreshLoading: false,
      keyWordTemp: "",
      keyWord: "",
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
      if (data.keyWord) {
        locationStore
          .gett(data.keyWord, page, data.pageInfo.size)
          .then((res) => {
            if (res === 200) {
              data.refreshLoading = false;
              data.isLoading = false;
              tableRef.value.scrollTo(0, 0);
            }
          });
      } else {
        locationStore
          .getCampus({ page, size: data.pageInfo.size })
          .then((res) => {
            if (res === 200) {
              tableRef.value.scrollTo(0, 0);
              data.isLoading = false;
            }
          });
      }
    };
    const HandleSizeChange = (size) => {
      data.isLoading = true;
      data.pageInfo.page = 1;
      data.refreshLoading = true;
      if (data.keyWord) {
        locationStore
          .getCampusByQuery(data.keyWord, data.pageInfo.page, size)
          .then((res) => {
            if (res === 200) {
              data.pageInfo.page = 1;
              data.refreshLoading = false;
              data.isLoading = false;
              tableRef.value.scrollTo(0, 0);
            }
            if (res === 400) {
              data.isLoading = false;
            }
          });
      } else {
        locationStore
          .getCampus({ page: data.pageInfo.page, size })
          .then((res) => {
            if (res === 200) {
              data.isLoading = false;
              tableRef.value.scrollTo(0, 0);
            }
            if (res === 400) {
              data.isLoading = false;
            }
          });
      }
    };

    const HandleSearchClick = () => {
      if (data.keyWordTemp) {
        data.pageInfo.page = 1;
        data.isLoading = true;
        data.keyWord = data.keyWordTemp;
        locationStore
          .getCampusByQuery(
            data.keyWord,
            data.pageInfo.page,
            data.pageInfo.size
          )
          .then((res) => {
            if (res === 200) {
              data.pageInfo.page = 1;
              data.isLoading = false;
              tableRef.value.scrollTo(0, 0);
            }
            if (res === 400) {
              data.isLoading = false;
            }
          });
      } else {
        ElMessage.warning("请输入关键词!");
      }
    };

    const HandleClear = () => {
      data.keyWord = "";
      (data.pageInfo.page = 1), (data.isLoading = true);
      locationStore
        .getCampus({ page: 1, size: data.pageInfo.size })
        .then((res) => {
          if (res === 200) {
            data.pageInfo.page = 1;
            data.refreshLoading = false;
            data.isLoading = false;
            tableRef.value.scrollTo(0, 0);
          }
        });
    };

    const HandleRefreshClick = () => {
      data.pageInfo.page = 1;
      data.isLoading = true;
      data.refreshLoading = true;
      if (data.keyWord) {
        locationStore
          .getCampusByQuery(
            data.keyWord,
            data.pageInfo.page,
            data.pageInfo.size
          )
          .then((res) => {
            if (res === 200) {
              data.pageInfo.page = 1;
              data.refreshLoading = false;
              data.isLoading = false;
              tableRef.value.scrollTo(0, 0);
            }
            if (res === 400) {
              data.isLoading = false;
              data.refreshLoading = false;
            }
          });
      } else {
        locationStore
          .getCampus({ page: 1, size: data.pageInfo.size })
          .then((res) => {
            if (res === 200) {
              data.pageInfo.page = 1;
              data.refreshLoading = false;
              data.isLoading = false;
              tableRef.value.scrollTo(0, 0);
            }
          });
      }
    };

    const rowStyle = ({ row, rowIndex }) => {
      return {
        height: "60px",
      };
    };

    const HandleAddClick = () => {
      bus.emit("showCampusAdd", { pageInfo: data.pageInfo });
    };

    const HandleEditClick = (value) => {
      bus.emit("showCampusEdit", { ...value, pageInfo: data.pageInfo });
    };
    const HandleDrawerClick = (value) => {
      bus.emit("showTeachingBuildingListDrawer", value);
    };
    const HandleUploadClick = () => {
      bus.emit("showCampusUploadDialog");
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
          locationStore.DeleteCampus(value);
        })
        .catch(() => {
          console.log("canceled...");
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
      tableRef,
      Search,
      HandleSearchClick,
      HandleClear,
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

.searchInput {
  max-width: 20%;
  margin: 0px 10px;
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