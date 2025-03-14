<template>
  <div class="border">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item to="/home"
        ><el-icon><Menu /></el-icon>首页</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="obj.path" v-for="obj of breadList">{{
        obj.meta.title
      }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import { ArrowRight } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";

export default {
  name: "breadcrumb",
  setup() {
    const route = useRoute();
    const breadList = ref([{ path: "qwq", meta: { title: "awa" } }]);

    watch(
      route,
      () => {
        breadList.value = route.matched.filter((obj) => {
          return obj.path != "/home/index" && obj.path != "/home";
        });
      },
      { immediate: true }
    );

    return {
      ArrowRight,
      breadList,
    };
  },
};
</script>

<style scoped>
.border {
  padding-bottom: 10px;
  border-bottom: solid #e4e7ed 1px;
}

span {
  vertical-align: text-top;
}

.el-breadcrumb__item {
  white-space: nowrap;
  vertical-align: baseline;
  line-height: 16px;
}

.el-breadcrumb {
  display: flex;
  flex-wrap: nowrap;
  white-space: nowrap;
  flex-direction: row;
}

</style>