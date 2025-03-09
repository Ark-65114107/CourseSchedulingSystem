<template>
  <scheduleBuilderNav />
  <router-view :key="route.path"></router-view>
</template>


<script>
import scheduleBuilderNav from "@/components/ScheduleManagement/scheduleBuilder/scheduleBuilderNav.vue";
import { useRoute } from "vue-router";
export default {
  name: "scheduleBuilder",
  components: {
    scheduleBuilderNav,
  },
  setup() {
    const route = useRoute();
    const query = route.query;
    return {
      query,
      route,
    };
  },
};
</script>

<style>
</style>