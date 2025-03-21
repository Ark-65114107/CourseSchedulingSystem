import request from "@/utils/request"

//根据排课任务id获取已经添加了课程的班级数组
export const getAssignedClassListApi = (id)=>{
    return request({
        url:"/task/getAssignedClassList",
        method:"get",
        params:{
            id
        }
    }).catch(()=>{})
}


