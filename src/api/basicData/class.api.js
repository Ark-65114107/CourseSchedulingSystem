import request from "@/utils/request"
import { ElMessage } from "element-plus"

export const getClassListApi = (parm)=>{
    return request({
        url:"/basicData/class/selectAllPage",
        method:"get",
        params:parm,
        isAbort:true

    }).catch(()=>{})
}

export const getSingleClassApi = (classId)=>{
    return request({
        url:`/basicData/class/selectById/${classId}`,
        method:"get",
        isAbort:true
    }).catch((error)=>{
        ElMessage.error(error.message);

    })
}

export const addClassListApi = (data)=>{
    return request({
        url:"/basicData/class/addClass",
        method:"post",
        data,
        isAbort:true
    }).catch(()=>{})
}

export const deleteClassApi = (classArray)=>{
    return request({
        url:`/basicData/class/deleteBatch`,
        method:"delete",
        params:{
            classIds:classArray
        },
        isAbort:true
    }).catch(()=>{})
}


export const editClassListApi = (classId,data)=>{
    return request({
        url:"/basicData/classes/editClass",
        method:"post",
        data:{
            data,
            classId,
        },
        isAbort:true
    }).catch(()=>{})
}