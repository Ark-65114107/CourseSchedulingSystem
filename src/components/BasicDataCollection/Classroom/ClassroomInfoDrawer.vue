<template>
  <el-drawer
    v-model="isDrawerVisible"
    title="查看教室信息"
    direction="rtl"
    size="42%"
  >
    <el-descriptions :title="datas.name" :column="1" border>
      <el-descriptions-item label="教室编号" width="100px">{{
        datas.id
      }}</el-descriptions-item>
      <el-descriptions-item label="教室名称" width="100px">{{
        datas.name
      }}</el-descriptions-item>
      <el-descriptions-item label="所属校区" width="100px">{{
        datas.campus
      }}</el-descriptions-item>
      <el-descriptions-item label="教学楼" width="100px">{{
        datas.teachingbuilding
      }}</el-descriptions-item>
      <el-descriptions-item label="所在楼层" width="100px">{{
        datas.floor
      }}</el-descriptions-item>
      <el-descriptions-item label="教室标签" width="100px">{{
        datas.tags
      }}</el-descriptions-item>
      <el-descriptions-item label="教室类型" width="100px">{{
        datas.type
      }}</el-descriptions-item>
      <el-descriptions-item label="可容纳人数" width="100px">{{
        datas.capacity
      }}</el-descriptions-item>
      <el-descriptions-item label="是否为固定教室" width="100px">{{
        boolToYesNo(datas.isAssigned)
      }}</el-descriptions-item>
      <el-descriptions-item label="是否有空调" width="100px">{{
        boolToYesNo(datas.hasAirConditioner)
      }}</el-descriptions-item>
      <el-descriptions-item label="是否启用" width="100px">{{
        boolToYesNo(datas.isAvailable)
      }}</el-descriptions-item>
      <el-descriptions-item label="教室描述" width="100px">{{
        datas.describe
      }}</el-descriptions-item>
      <el-descriptions-item label="管理部门" width="100px">{{
        datas.departmentId
      }}</el-descriptions-item>
      <el-descriptions-item label="周安排学时" width="100px">{{
        datas.classhour
      }}</el-descriptions-item>
      <el-descriptions-item label="教室面积" width="100px">{{
        datas.area
      }}</el-descriptions-item>
      <el-descriptions-item label="桌椅类型" width="100px">{{
        datas.desktype
      }}</el-descriptions-item>
    </el-descriptions>
  </el-drawer>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import bus from "@/bus/bus.js";
import { useLocationStore } from "@/store/locationStore";
import { getSingleClassroomApi } from "@/api/basicData/classroom.api";

export default {
  name: "ClassroomInfoDrawer",
  setup() {
    const locationStore = useLocationStore();
    const isDrawerVisible = ref(false);
    var datas = "qwq";
    const data = ref({});

    const boolToYesNo = (value) => {
      return value ? "是" : "否";
    };

    onMounted(() => {
      bus.on("showClassroomInfoDrawer", (value) => {
        getClassroomInfo(value.roomId);
        isDrawerVisible.value = true;
      });
    });

    const getClassroomInfo = (id) => {
      getSingleClassroomApi(id).then((res) => {
        console.log(res);
      });
    };

    return {
      isDrawerVisible,
      data,
      datas,
      boolToYesNo,
      locationStore,
      getClassroomInfo,
    };
  },
};
</script>

<style>
</style>