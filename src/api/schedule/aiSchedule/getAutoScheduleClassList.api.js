import request from "@/utils/request"

export const getAutoScheduleClassListApi = (taskId) => {
    return request({
        url: "/task/getAutoScheduleClassList",
        method: "get",
        params: {
            taskId,
        }
    }).catch(() => {})
}


