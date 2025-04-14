import fakeRequest from "@/utils/fakeRequest"
import request from "@/utils/request"

//获取课程列表
export const getCourseListApi = (taskId) => {
    return fakeRequest({
        url: "/task/getCourseList",
        method: "get",
        params: {
            taskId,
        }
    }).catch(() => {})
}