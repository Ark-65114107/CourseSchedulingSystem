import fakeRequest from "@/utils/fakeRequest"
import request from "@/utils/request"


export const cellCreateApi = (taskId,classId,teachingClassId,period,cellIndex) => {
    return fakeRequest({
        url: "/task/cellCreate",
        method: "post",
        data: {
            taskId,
            classId,
            teachingClassId,//教学班
            period,
            cellIndex,
        }
    }).catch(() => {})
}


