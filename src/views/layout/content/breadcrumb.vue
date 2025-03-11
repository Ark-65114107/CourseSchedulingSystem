<template>
    <div class="border">
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item to="/home" ><el-icon><Menu /></el-icon> <span>首页</span></el-breadcrumb-item>
            <el-breadcrumb-item :to="obj.path" v-for="obj of breadList">{{obj.meta.title}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
import { ArrowRight } from '@element-plus/icons-vue'
import {useRoute ,useRouter} from 'vue-router'
import { ref, watch } from 'vue'

export default {
    name:'breadcrumb',
    setup(){
      const route = useRoute()
      const breadList = ref([{path:"qwq",meta:{title:"awa"}}])
    
    watch(route,()=>{
      breadList.value = route.matched.filter(obj=>{
        return obj.path != '/home/index' && obj.path != '/home'
      })
    },{immediate:true})
      
      return {
        ArrowRight,
        breadList,
      }
    }
}
</script>

<style scoped>
  .border{
    padding-bottom: 10px;
    border-bottom: solid #E4E7ED 1px;
  }

  span{
    vertical-align:text-top;
  }

  .el-breadcrumb-item{
      white-space: nowrap;
  }

  .el-breadcrumb{
    display: flex;
    flex-wrap: nowrap;
    white-space: nowrap;
    overflow-x: hidden;
  }
</style>