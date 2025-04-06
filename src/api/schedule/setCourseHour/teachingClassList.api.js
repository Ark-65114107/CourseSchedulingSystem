import request from "@/utils/request"

//获取课程的教学班列表
export const getTeachingClassListApi = (taskId,courseId) => {
    return request({
        url: "/task/getTeachingClassList",
        method: "get",
        params: {
            taskId,
            courseId
        }
    }).catch(() => {})
}