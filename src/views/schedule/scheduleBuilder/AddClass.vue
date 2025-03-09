<template>
  <div class="treeBody">
    <div class="treeControl">
      <el-input
        placeholder="搜索班级"
        v-model="keyWord"
        :prefix-icon="Search"
      />
      <el-button type="primary">完成</el-button>
    </div>
    <el-scrollbar height="300px">
      <el-tree
        :data="data"
        :filter-node-method="treeFilter"
        @check-change="HandleCheckChange"
        show-checkbox
        default-expand-all
        ref="treeRef"
      />
    </el-scrollbar>
  </div>
  <div></div>
</template>

<script>
import { reactive, ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";

export default {
  name: "AddClass",
  setup() {
    const keyWord = ref();
    const treeRef = ref();
    let res = ref([]);
    const data = reactive([
    ]);

    watch(keyWord, (value) => {
      treeRef.value.filter(value);
    });

    const treeFilter = (value, data) => {
      if (!value) return true;
      return data.label.includes(value);
    };

    const HandleCheckChange = (obj, value, isChildrenChecked) => {
      console.log(obj, value);
      if (obj.select) {
        if (value) {
          res.value.push(obj.id);
        } else {
          res.value = res.value.filter((o) => {
            if (o.id == obj.id) {
              return true;
            }
          });
        }
      }
    };

    return {
      keyWord,
      treeRef,
      treeFilter,
      data,
      Search,
      HandleCheckChange,
      res,
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