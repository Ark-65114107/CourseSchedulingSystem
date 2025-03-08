<template>
<scheduleBuilderNav/>
</template>


<script>
import scheduleBuilderNav from '@/components/ScheduleManagement/scheduleBuilder/scheduleBuilderNav.vue'
import { useRoute } from 'vue-router'
export default {
    name:"scheduleBuilder",
    components:{
      scheduleBuilderNav
    },
    setup(){

        const query = useRoute().query
        return{
            query
        }
    }
}
</script>

<style>

</style>