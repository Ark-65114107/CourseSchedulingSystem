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

//搜索教学班
export const searchTeachingClassApi = (taskId,page,size,keyword) => {
    return request({
        url: "/task/searchListTeachingClass",
        method: "get",
        params:{
            taskId,
            page,
            size,
            keyword
        },
        isAbort: true
    }).catch(() => { })
}

//搜索教师
export const searchTeacherApi = (taskId,keyword) => {
    return request({
        url: "/task/searchListTeacher",
        method: "get",
        params:{
            taskId,
            keyword
        },
        isAbort: true
    }).catch(() => { })
}

//更新教师的教教学班列表
export const updateTeacherTeachingClassApi = (taskId,teacherId,teachingClassList) => {
    return request({
        url: "/task/updateTeacherTeachingClass",
        method: "post",
        params:{
            taskId,
            teacherId,
            teachingClassList,
        },
        isAbort: true
    }).catch(() => { })
}
//更新教学班的教师列表
export const updateTeachingClassTeacherApi = (taskId,teachingClassId,teacherList) => {
    return request({
        url: "/task/updateTeachingClassTeacher",
        method: "post",
        params:{
            taskId,
            teachingClassId,
            teacherList
        },
        isAbort: true
    }).catch(() => { })
}



