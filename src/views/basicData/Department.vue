<template>
  <departmentList />
</template>

<script>
import departmentList from "@/components/BasicDataCollection/Department/DepartmentList.vue";
import { onBeforeMount } from 'vue';
import { useAcademicStore } from '@/store/academicStore';
export default {
  name: "Department",
  components: {
    departmentList,
  },
  setup() {
    onBeforeMount(() => {
      useAcademicStore().initDepartments();
    });
  },
};
</script>

<style>
</style>