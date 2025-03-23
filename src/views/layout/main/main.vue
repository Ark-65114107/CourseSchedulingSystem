<template>
    <el-main>
      <breadcrumbVue/>
      <router-view :key="route.path" />
    </el-main>
</template>

<script>
import { useRoute } from "vue-router";
import breadcrumbVue from '../content/breadcrumb.vue';
export default {
  name: "theMain",
  components:{
    breadcrumbVue
  },
  setup(){
    const route = useRoute();
    return {
      route,
    };
  },
};
</script>

<style>
  .el-main{
    padding-top: 10px;
    width: 100%;
    padding: 10px;
  }

</style>
