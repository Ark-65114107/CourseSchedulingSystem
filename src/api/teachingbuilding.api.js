import request from "@/utils/request"

//获取教学楼列表数据
export const getTeachingBuildingListApi = (parm)=>{
    return request({
        url:"/teachingbuilding/list",
        method:"get",
        params:parm,
        isAbort:true
    }).catch(()=>{})
}

//获取单个教学楼数据
export const getCampusByQueryApi = (parm)=>{
    return request({
        url:"/campuses/search",
        method:"post",
        data:parm,
        isAbort:true
    }).catch(()=>{})
}

//添加教学楼数据
export const addCampusApi = (parm)=>{
    return request({
        url:"/campuses/create",
        method:"post",
        data:parm,
        isAbort:true
    }).catch(()=>{})   
}

//修改教学楼数据
export const updateCampusApi = (parm)=>{
    return request({
        url:"/campuses/update",
        method:"post",
        data:parm
    }).catch(()=>{})
}

//删除教学楼数据
export const deleteCampusApi = (parm)=>{
    return request({
        url:"/campuses/delete",
        method:"post",
        data:parm
    }).catch(()=>{})
}

