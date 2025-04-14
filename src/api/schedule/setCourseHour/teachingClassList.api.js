import fakeRequest from "@/utils/fakeRequest"
import request from "@/utils/request"

//获取课程的教学班列表
export const getTeachingClassListApi = (taskId,courseId) => {
    return fakeRequest({
        url: "/task/getTeachingClassList",
        method: "get",
        params: {
            taskId,
            courseId
        }
    }).catch(() => {})
}