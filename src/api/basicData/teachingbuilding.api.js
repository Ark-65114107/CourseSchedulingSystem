import request from "@/utils/request"

//获取教学楼列表数据
export const getTeachingBuildingListApi = (parm)=>{
    return request({
        url:"/teachingbuilding/selectPage",
        method:"get",
        params:parm,
        isAbort:true
    }).catch(()=>{})
}

//获取所有教学楼数据
export const getAllTeachingBuildingApi = ()=>{
    return request({
        url:"/building/selectAll",
        method:"get",
        isAbort:true
    }).catch(()=>{})
}

//筛选
export const getTeachingBuildingByQueryApi = (parm)=>{
    return request({
        url:"/building/selectById",
        method:"post",
        data:parm,
        isAbort:true
    }).catch(()=>{})
}

//添加教学楼数据
export const addTeachingBuildingApi = (parm)=>{
    return request({
        url:"/campuses/create",
        method:"post",
        data:parm,
        isAbort:true
    }).catch(()=>{})   
}

//修改教学楼数据
export const updateTeachingClassApi = (parm)=>{
    return request({
        url:"/campuses/update",
        method:"post",
        data:parm
    }).catch(()=>{})
}

//删除教学楼数据
export const deleteTeachingClassApi = (parm)=>{
    return request({
        url:"/campuses/delete",
        method:"post",
        data:parm
    }).catch(()=>{})
}

