import request from "@/utils/request"

export const cellCreateApi = (taskId,classId,teachingClassId,period,cellIndex) => {
    return request({
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


