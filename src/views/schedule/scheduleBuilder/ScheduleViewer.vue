<template>
  <div class="scheduleViewerBody">
    <div class="filterContianer">

    </div>
    <div class="mainContainer">
      <div class="clssListContainer"></div>
      <div class="scheduleViewerContainer"></div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import {
  getClassTreeApi,
  setClassTreeApi,
} from "@/api/schedule/addClass/classTree.api.js";

import { getClassListApi } from "@/api/schedule/addClass/classList.api.js";
import { useRoute } from "vue-router";
import router from "@/router";

export default {
  name: "scheduleViewer",
  setup() {


    return {
     
    };
  },
};


</script>

<style scoped>
.scheduleViewerBody {
  height: 520px;
  display: flex;
  margin: 10px 0px 0px 0px;
  flex-direction: column;
  background: white;
  border: solid 1px #dcdfe6;
  border-radius: 8px;
}
</style>