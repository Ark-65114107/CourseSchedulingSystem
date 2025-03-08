import request from "@/utils/request"

//获取校区列表数据
export const getTaskListApi = (parm)=>{
    return request({
        url:"/task/list",
        method:"get",
        params:parm,
        isAbort:true
    }).catch(()=>{})
}

//获取单个校区数据
export const getCampusByQueryApi = (parm)=>{
    return request({
        url:"/campuses/search",
        method:"post",
        data:parm,
        isAbort:true
    }).catch(()=>{})
}

//添加校区数据
export const addCampusApi = (parm)=>{
    return request({
        url:"/campuses/create",
        method:"post",
        data:parm,
        isAbort:true
    }).catch(()=>{})   
}

//修改校区数据
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

