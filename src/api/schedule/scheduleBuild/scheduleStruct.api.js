import fakeRequest from "@/utils/fakeRequest"


//根据班级id获取对应班级的课表信息(排课)
export const getScheduleStructApi = (taskId,classId)=>{
    return fakeRequest({
        url:"/task/getScheduleStruct",
        method:"get",
        params:{
            taskId,
            classId
        }
    }).catch(()=>{})
}


