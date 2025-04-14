<template>
  <div class="treeBody">
    <div class="treeControl">
      <el-input
        placeholder="搜索班级"
        v-model="keyWord"
        :prefix-icon="Search"
      />
    </div>
    <el-scrollbar height="300px" v-loading="isLoading">
      <el-tree
        :data="data"
        :filter-node-method="treeFilter"
        node-key="id"
        @check-change="HandleCheckChange"
        show-checkbox
        default-expand-all
        :default-checked-keys="defaultChecked"
        ref="treeRef"
      >
        <template #default="{ node, data }">
          <span>
            {{node.label}}
          </span>
          <el-tag v-show="node.isFixedRoom">固定教室</el-tag>
        </template>
      </el-tree>
    </el-scrollbar>
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
import { ElMessage } from "element-plus";

export default {
  name: "AddClass",
  setup() {
    const route = useRoute();
    const keyWord = ref();
    const treeRef = ref();
    let res = ref([]);
    const data = ref([]); //班级tree的数据
    const isLoading = ref(false);
    let defaultChecked = ref([]);

    onMounted(() => {
      getClassTree();
    });

    const setClassTree = () => {
      let id = route.query.id;
      setClassTreeApi({ id, classList: res.value }).then((res) => {
        if (res.code === 200) {
          ElMessage.success("操作成功!");
        }
        getClassList();
      });
    };

    const getClassTree = () => {
      isLoading.value = true;
      getClassTreeApi()
        .then((res) => {
          if (res.meta.code == 200) {
            isLoading.value = false;
            data.value = res.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          isLoading.value = false;
        });
      getClassList();
    };

    const getClassList = () => {
      isLoading.value = true;
      getClassListApi(route.query.id)
        .then((res) => {
          if (res) {
            if (res.code == 200) {
              defaultChecked.value = res.data.map((c) => c.id);
            }
          }
        })
        .finally(() => {
          ElMessage.success("操作成功!");

          isLoading.value = false;
        });
    };

    watch(keyWord, (value) => {
      treeRef.value.filter(value);
    });

    const treeFilter = (value, data) => {
      //搜索过虑
      if (!value) return true;
      return data.label.includes(value);
    };

    let timer;

    const debounce = function (fun, delay) {
      //防抖函数
      return function () {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          fun();
        }, delay);
      };
    };

    const HandleCheckChange = (obj, value, isChildrenChecked) => {
      if (obj.select) {
        if (value) {
          res.value.push(obj.id);
          debounce(setClassTree, 400)();
        } else {
          res.value = res.value.filter((o) => {
            if (o.id == obj.id) {
              return true;
            }
          });
          debounce(setClassTree, 400)();
        }
      }
    };

    let isResEmpty = computed(() => {
      return res.value.length <= 0;
    });

    const HandleDoneClick = () => {
      setClassTree();
      router.push({ name: "setCourse" });
    };
    const HandleSaveClick = () => {
      setClassTree();
    };

    return {
      keyWord,
      treeRef,
      data,
      Search,
      treeFilter,
      HandleCheckChange,
      HandleDoneClick,
      HandleSaveClick,
      res,
      isLoading,
      isResEmpty,
      defaultChecked,
    };
  },
};
</script>

<style scoped>
.treeBody {
  height: max-content;
  background: white;
  padding: 10px 20px;
  margin: 10px 0px;
  border-radius: 8px;
}

.el-scrollbar {
  border: solid 1px #d4d7de;
  padding: 10px;
}

.el-tree {
  min-height: 300px;
  padding: 10px;
}

.treeControl {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  white-space: nowrap;
  margin: 10px 10px 10px 0px;
}

.el-input {
  width: 250px;
  margin: 0px 10px 0px 0px;
}
</style>