import request from "@/utils/request"

//更新指定课程的指定班级的课时数据 参数:任务id,班级id,课程id,新值
export const updateCourseHour = (taskId,teachingClassId,courseId,courseHour) => {
    return request({
        url: "/task/updateCourseHour",
        method: "post",
        data: {
            taskId,
            courseId,
            teachingClassId,
            courseHour,
        }
    }).catch(() => {})
}

//批量更新指定课程的指定班级的周学时 参数:任务ID,课程ID,教学班ID数组,新值
export const batchUpdateCourseHour = (taskId,courseId,teachingClassList,courseHour) => {
    return request({
        url: "/task/batchUpdateCourseHour",
        method: "post",
        data: {
            taskId,
            courseId,
            teachingClassList,
            courseHour
        }
    }).catch(() => {})
}





