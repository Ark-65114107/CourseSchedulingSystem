<template>
  <el-select v-model="value" placeholder="Select" style="width: 240px">
    <el-option
      v-for="item in cities"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
    <template #footer>
      <el-button v-if="!isAdding" text bg size="small" @click="onAddOption">
        增加班级
      </el-button>
      <template v-else>
        <el-input
          v-model="optionName"
          class="option-input"
          placeholder="班级名"
          size="small"
        />
        <el-button type="primary" size="small" @click="onConfirm">
          确认
        </el-button>
        <el-button size="small" @click="clear">取消</el-button>
      </template>
    </template>
  </el-select>
</template>

<script lang="ts" setup name="chooseclass">
import { ref, watch } from 'vue'

// 定义 props 和 emits
const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  }
})
const emit = defineEmits(["update:modelValue"])

// 内部绑定的值
const value = ref(props.modelValue)

// 同步 v-model 的值
watch(value, (newValue) => {
  emit("update:modelValue", newValue)
})

const isAdding = ref(false)
const optionName = ref('')
const cities = ref([
  {
    value: '软工zb24-1',
    label: '软工zb24-1',
  },
  {
    value: '测绘24-1',
    label: '测绘24-1',
  },
  {
    value: '软工23-1',
    label: '软工23-1',
  },
  {
    value: '遥感23-2',
    label: '遥感23-2',
  },
  {
    value: '物联网23-3',
    label: '物联网23-3',
  },
  {
    value: '水工22-1',
    label: '水工22-1',
  },
])

const onAddOption = () => {
  isAdding.value = true
}

const onConfirm = () => {
  if (optionName.value) {
    cities.value.push({
      label: optionName.value,
      value: optionName.value,
    })
    clear()
  }
}

const clear = () => {
  optionName.value = ''
  isAdding.value = false
}
</script>

<style scoped>
.option-input {
  width: 100%;
  margin-bottom: 8px;
}
</style>