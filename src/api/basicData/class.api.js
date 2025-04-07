import request from "@/utils/request"

export const getClassListApi = (parm)=>{
    return request({
        url:"/classes",
        method:"get",
        params:parm,
        isAbort:true

    }).catch(()=>{})
}