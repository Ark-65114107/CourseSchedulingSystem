import request from "@/utils/request"

//获取课程列表
export const getCourseListApi = (taskId) => {
    return request({
        url: "/task/getCourseList",
        method: "get",
        params: {
            taskId,
        }
    }).catch(() => {})
}