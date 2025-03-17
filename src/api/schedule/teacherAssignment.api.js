import request from "@/utils/request"

//获取排课任务下教师的任课数据
export const getListTeacherTeachingClassApi = (taskId) => {
    return request({
        url: "/task/getListTeacherTeachingClass",
        method: "get",
        params: {
            taskId,
        },
        isAbort: true
    }).catch(() => { })
}

//获取排课任务下单个教师的任课数据
export const getSingleTeacherTeachingClassApi = (taskId, teacherId) => {
    return request({
        url: "/task/getSingleTeacherTeachingClass",
        method: "get",
        params: { taskId, teacherId },
        isAbort: true
    }).catch(() => { })
}

//添加校区数据
export const searchTeachingClassApi = (taskId,keyword) => {
    return request({
        url: "/task/searchListTeachingClass",
        method: "get",
        params:{
            taskId,
            keyword
        },
        isAbort: true
    }).catch(() => { })
}



