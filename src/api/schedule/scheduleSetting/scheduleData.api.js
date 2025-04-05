import request from "@/utils/request"

export const getScheduleSettingStructApi = (taskId)=>{
    return request({
        url:"/task/getScheduleSettingStruct",
        method:"get",
        params:{
            taskId
        }
    }).catch(()=>{})
}

export const updateScheduleSettingStructApi = (taskId,period,cellIndex,type)=>{
    return request({
        url:"/task/updateScheduleSettingStructApi",
        method:"post",
        data:{
            taskId,
            period,
            cellIndex,
            type
        }
    }).catch(()=>{})
}


