import request from "@/utils/request"

//获取作息表单数据
export const getScheduleRoutineApi = (taskId)=>{
    return request({
        url:"/task/getScheduleRoutine",
        method:"get",
        params:{
            taskId
        },
        isAbort:true
    }).catch(()=>{})
}

//更新课程时长
export const updateMaxWeekApi = (taskId,newValue)=>{
    return request({
        url:"/task/updateMaxWeek",
        method:"post",
        data:{
            taskId,
            newValue
        }
    }).catch(()=>{})
}
//更新课程时长
export const updateCourseDurationApi = (taskId,newValue)=>{
    return request({
        url:"/task/updateCourseDuration",
        method:"post",
        data:{
            taskId,
            newValue
        }
    }).catch(()=>{})
}

//更新课间时长
export const updateBreakDurationApi = (taskId,newValue)=>{
    return request({
        url:"/task/updateBreakDuration",
        method:"post",
        data:{
            taskId,
            newValue
        }
    }).catch(()=>{})
}

//更新节次
export const updatePeriodApi = (taskId,daytime,newValue)=>{
    return request({
        url:"/task/updatePeriod",
        method:"post",
        data:{
            taskId,
            daytime,//1早自习2上午3下午4晚上5晚自习
            newValue,
        }
    }).catch(()=>{})
}

//更新节次时间
export const updatePeriodTimeApi = (taskId,period,newValue)=>{
    return request({
        url:"/task/updatePeriodTime",
        method:"post",
        data:{
            taskId,
            period,
            newValue,//时间段数组
        }
    }).catch(()=>{})
}

//更新午休/晚休时长
export const updateRestTimeDurationApi = (taskId,index,newValue)=>{
    return request({
        url:"/task/updateRestTimeDuration",
        method:"post",
        data:{
            taskId,
            index,
            newValue,
        }
    }).catch(()=>{})
}

