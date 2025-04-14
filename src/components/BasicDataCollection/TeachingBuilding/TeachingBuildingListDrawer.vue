<template>
  <el-drawer
    v-model="isDrawerVisible"
    title="教学楼管理"
    direction="rtl"
    size="64%"
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
        :data="buildings"
        :row-style="rowStyle"
        @selection-change="HandleSelectChange"
      >
        <el-table-column type="selection" :selectable="selectable" width="55" />
        <el-table-column prop="buildingId" label="教学楼编号" />
        <el-table-column prop="buildingName" label="教学楼名称" />
        <el-table-column prop="campus" label="所属校区" />
        <el-table-column
          prop="enabled"
          label="是否可用"
          :formatter="isAvailable"
        />

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
    </div>
  </el-drawer>
  <TeachingBuildingEditDialog />
</template>

<script>
import TeachingBuildingEditDialog from "./TeachingBuildingEditDialog.vue";

import bus from "@/bus/bus.js";
import { storeToRefs } from "pinia";
import { computed, onMounted, reactive, ref, toRefs } from "vue";
import { ElMessageBox } from "element-plus";
import { useLocationStore } from "@/store/locationStore/index.js";

import { ArrayDelete, SingleDelete } from "@/hooks/list/useDelete.js";
import { getAllTeachingBuildingApi } from '@/api/basicData/teachingbuilding.api';

export default {
  name: "TeachingBuildingListDrawer",
  components: {
    TeachingBuildingEditDialog,
  },
  setup() {
    const locationStore = useLocationStore();
    const { campuses,campusMap,teachingbuildings } = storeToRefs(locationStore);

    onMounted(() => {
      bus.on("showTeachingBuildingListDrawer", (value) => {
        data.campusId = value.id;
        data.isDrawerVisible = true; //打开抽屉
        getBuildings(value.name)
      });
    });

    const buildings = ref([])

    const getBuildings = (name)=>{
      getAllTeachingBuildingApi().then(res=>{
        console.log(res);
        if(res){
          if(res.code == 200){
            buildings.value = res.data.filter(b=>{
              return b.campus == name
            })
          }
        }
      })
    }

    const data = reactive({
      isDeleteShow: false,
      isDrawerVisible: false,
      campusId: "",
      deleteValue: [],
    });

    const teachingBuildingsOfcampus = computed(() => {
      return locationStore.getBuildingsByCampus(data.campusId).map(t=>({...t,campus:campusMap.value.get(t.campusId)}));
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
      bus.emit("showTeachingBuildingAdd", data.campusId);
    };

    const HandleEditClick = (value) => {
      bus.emit("showTeachingBuildingEdit", value);
    };

    const HandleArrayDelete = () => {
      ElMessageBox.confirm("确认删除吗?", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          teachingbuildings.value = ArrayDelete(
            teachingbuildings.value,
            data.deleteValue
          );
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
          teachingbuildings.value = SingleDelete(
            teachingbuildings.value,
            value
          );
        })
        .catch(() => {
          console("canceled...");
        });
    };

    const isAvailable = (row) => {
      return row.isAvailable ? "是" : "否";
    };

    return {
      ...toRefs(data),
      campuses,
      teachingbuildings,
      HandleArrayDelete,
      HandleSingleDelete,
      HandleSelectChange,
      HandleAddClick,
      HandleEditClick,
      rowStyle,
      isAvailable,
      teachingBuildingsOfcampus,
      buildings
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