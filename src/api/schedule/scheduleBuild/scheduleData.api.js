import request from "@/utils/request"

//根据班级id获取对应班级的课表信息(排课)
export const getScheduleDataApi = (taskId,classId)=>{
    return request({
        url:"/task/getScheduleData",
        method:"get",
        params:{
            taskId,
            classId
        }
    }).catch(()=>{})
}


