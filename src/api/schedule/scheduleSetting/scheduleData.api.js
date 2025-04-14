import fakeRequest from "@/utils/fakeRequest"

export const getScheduleSettingStructApi = (taskId)=>{
    return fakeRequest({
        url:"/task/getScheduleSettingStruct",
        method:"get",
        params:{
            taskId
        }
    }).catch(()=>{})
}

export const updateScheduleSettingStructApi = (taskId,period,cellIndex,type)=>{
    return fakeRequest({
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


