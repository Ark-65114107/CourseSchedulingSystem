import fakeRequest from "@/utils/fakeRequest"
import request from "@/utils/request"

//获取教学楼列表数据
export const getTeachingBuildingListApi = (parm)=>{
    return fakeRequest({
        url:"/teachingbuilding/list",
        method:"get",
        params:parm,
        isAbort:true
    }).catch(()=>{})
}

//获取所有教学楼数据
export const getAllTeachingBuildingApi = ()=>{
    return request({
        url:"/basicData/building/selectAll",
        method:"get",
        isAbort:true
    }).catch(()=>{})
}

//筛选
export const getTeachingBuildingByQueryApi = (parm)=>{
    return fakeRequest({
        url:"/building/selectById",
        method:"post",
        data:parm,
        isAbort:true
    }).catch(()=>{})
}

//添加教学楼数据
export const addTeachingBuildingApi = (parm)=>{
    return fakeRequest({
        url:"/campuses/create",
        method:"post",
        data:parm,
        isAbort:true
    }).catch(()=>{})   
}

//修改教学楼数据
export const updateTeachingClassApi = (parm)=>{
    return fakeRequest({
        url:"/campuses/update",
        method:"post",
        data:parm
    }).catch(()=>{})
}

//删除教学楼数据
export const deleteTeachingClassApi = (parm)=>{
    return fakeRequest({
        url:"/campuses/delete",
        method:"post",
        data:parm
    }).catch(()=>{})
}

