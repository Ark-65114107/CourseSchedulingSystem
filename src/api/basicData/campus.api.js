import fakeRequest from "@/utils/fakeRequest"
import request from "@/utils/request"

//获取校区列表数据
export const getCampusListApi = (parm)=>{
    return fakeRequest({
        url:"/campuses/list",
        method:"get",
        params:parm,
        isAbort:true
    }).catch(()=>{})
}

//获取单个校区数据
export const getCampusByQueryApi = (parm)=>{
    return fakeRequest({
        url:"/campuses/search",
        method:"post",
        data:parm,
        isAbort:true
    }).catch(()=>{})
}

//添加校区数据
export const addCampusApi = (parm)=>{
    return fakeRequest({
        url:"/campuses/create",
        method:"post",
        data:parm,
        isAbort:true
    }).catch(()=>{})   
}

//修改校区数据
export const updateCampusApi = (parm)=>{
    return fakeRequest({
        url:"/campuses",
        method:"post",
        data:parm
    }).catch(()=>{})
}

//删除校区数据
export const deleteCampusApi = (parm)=>{
    return fakeRequest({
        url:"/campuses",
        method:"post",
        data:parm
    }).catch(()=>{})
}

