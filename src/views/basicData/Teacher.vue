<template>
  <TeacherList />
</template>

<script>
import TeacherList from "@/components/BasicDataCollection/Teacher/TeacherList.vue";
import { usePersonnelStore } from '@/store/personnelStore';
import { onBeforeMount } from 'vue';
export default {
  name: "Teacher",
  components: {
    TeacherList,
  },
  setup() {
    onBeforeMount(() => {
      usePersonnelStore().initTeachers();
    });
  },
};
</script>

<style>
</style>