import request from "@/utils/request"

//获取课程下相同学时的教学班
export const getListTeachingClassbyHourAndCampusApi = (taskId,teachingClassId,keyword)=>{
    return request({
        url:"/task/getListTeachingClassbyHourAndCampus",
        method:"get",
        params:{
            taskId,
            teachingClassId,
            keyword
        }
    }).catch(()=>{})
}
