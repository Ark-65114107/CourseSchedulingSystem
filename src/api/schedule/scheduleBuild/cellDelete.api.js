import request from "@/utils/request"

export const cellDeleteApi = (taskId,classId,cellId) => {
    return request({
        url: "/task/cellDelete",
        method: "post",
        data: {
            taskId,
            classId,
            cellId,
        }
    }).catch(() => {})
}


