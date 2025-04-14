import request from "@/utils/request"
import fakeRequest from "@/utils/fakeRequest"

export const setAutoScheduleSettingApi = (classList,settings) => {
    return fakeRequest({
        url: "/task/getAutoScheduleClassList",
        method: "post",
        data: {
            classList,
            settings
        }
    }).catch(() => {})
}


