import request from "@/utils/request"

//根据班级id获取对应班级的教学班列表
export const getTeachingClassListApi = (taskId,classId)=>{
    return request({
        url:"/task/getListTeachingClassByClass",
        method:"get",
        params:{
            taskId,
            classId
        }
    }).catch(()=>{})
}


