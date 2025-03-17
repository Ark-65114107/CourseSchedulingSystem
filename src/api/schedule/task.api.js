import request from "@/utils/request"

//获取排课任务列表数据
export const getTaskListApi = (parm)=>{
    return request({
        url:"/task/list",
        method:"get",
        params:parm,
        isAbort:true
    }).catch(()=>{})
}


export const getTaskByQueryApi = (parm)=>{
    return request({
        url:"/task/search",
        method:"post",
        data:parm,
        isAbort:true
    }).catch(()=>{})
}


export const addCampusApi = (parm)=>{
    return request({
        url:"/campuses/create",
        method:"post",
        data:parm,
        isAbort:true
    }).catch(()=>{})   
}

export const updateCampusApi = (parm)=>{
    return request({
        url:"/campuses/update",
        method:"post",
        data:parm
    }).catch(()=>{})
}

//删除校区数据
export const deleteCampusApi = (parm)=>{
    return request({
        url:"/campuses/delete",
        method:"post",
        data:parm
    }).catch(()=>{})
}

