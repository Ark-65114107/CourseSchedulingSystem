import request from "@/utils/request"

export const setAutoScheduleSettingApi = (classList,settings) => {
    return request({
        url: "/task/getAutoScheduleClassList",
        method: "post",
        data: {
            classList,
            settings
        }
    }).catch(() => {})
}


