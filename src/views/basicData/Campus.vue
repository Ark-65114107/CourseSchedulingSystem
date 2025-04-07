<template>
  <CampusList/>
</template>

<script>
import CampusList from "@/components/BasicDataCollection/Campus/CampusList.vue"
import { onBeforeMount } from 'vue'
import { useLocationStore } from '@/store/locationStore'

export default {
    name:'Campus',
    components:{
      CampusList
    },
    setup(){
      onBeforeMount(()=>{
        useLocationStore().initCampuses()
      })
    }
}
</script>
  
<style>

</style>