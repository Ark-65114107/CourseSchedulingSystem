import request from "@/utils/request"

//根据班级id获取对应班级的课表信息(排课)
export const cellCreateApi = (taskId,classId,cellId,teachingClassId,period,cellIndex,consecutiveClassPeriods) => {
    return request({
        url: "/task/cellCreate",
        method: "post",
        data: {
            taskId,
            classId,
            cellId,
            teachingClassId,//教学班
            period,
            cellIndex,
            consecutiveClassPeriods
        }
    }).catch(() => {})
}


