import fakeRequest from "@/utils/fakeRequest"
import request from "@/utils/request"

export const getListTeachingClassApi = (taskId,courseId,)=>{
    return fakeRequest({
        url:"/task/getListTeachingClassByCourse",
        method:"get",
        params:{
            taskId,
            courseId
        }
    }).catch(()=>{})
}

//获取指定教学班数据 参数:任务id,课程id,教学班Id
export const getSingleTeachingClassApi = (taskId,teachingClassId)=>{
    return fakeRequest({
        url:"/task/getSingleTeachingClass",
        method:"get",
        isAbort:true,
        params:{
            taskId,
            teachingClassId
        },
    }).catch(()=>{})
}

export const updateTeachingClassApi = (taskId,teachingClassId,teachingClass)=>{
    return fakeRequest({
        url:"/task/updateTeachingClass",
        method:"post",
        isAbort:true,
        data:{
            taskId,
            teachingClassId,
            teachingClass
        },
    }).catch(()=>{})
}

