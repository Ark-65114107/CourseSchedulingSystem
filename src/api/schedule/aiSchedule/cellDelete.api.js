import request from "@/utils/request"

export const getClassAiSettingApi = (taskId,classId,cellId) => {
    return request({
        url: "/task/getClassAiSetting",
        method: "get",
        params: {
            taskId,
            classId
        }
    }).catch(() => {})
}


