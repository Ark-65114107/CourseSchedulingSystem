import fakeRequest from "@/utils/fakeRequest"

export const getAutoScheduleClassListApi = (taskId) => {
    return fakeRequest({
        url: "/task/getAutoScheduleClassList",
        method: "get",
        params: {
            taskId,
        }
    }).catch(() => {})
}


