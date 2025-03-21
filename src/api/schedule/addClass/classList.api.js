import request from "@/utils/request"

//根据排课任务id获取班级id数组
export const getClassListApi = (id)=>{
    return request({
        url:"/task/getClassList",
        method:"get",
        params:{
            id
        }
    }).catch(()=>{})
}