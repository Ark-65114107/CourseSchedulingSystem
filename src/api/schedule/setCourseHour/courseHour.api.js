import request from "@/utils/request"

//更新指定课程的指定班级的课时数据 参数:任务id,班级id,课程id,新值
export const updateCourseHour = (taskId,classId,courseId,courseHour) => {
    return request({
        url: "/task/updateCourseHour",
        method: "post",
        data: {
            courseHour,
            taskId,
            courseId,
            classId
        }
    }).catch(() => {})
}

//批量更新指定课程的所有班级的课时数据 参数:任务ID,课程ID,新值
export const batchUpdateCourseHour = (taskId,courseId,courseHour) => {
    return request({
        url: "/task/batchUpdateCourseHour",
        method: "post",
        data: {
            taskId,
            courseId,
            courseHour
        }
    }).catch(() => {})
}





