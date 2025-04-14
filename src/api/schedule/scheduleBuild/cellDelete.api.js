import fakeRequest from "@/utils/fakeRequest"
import request from "@/utils/request"

export const cellDeleteApi = (taskId,classId,cellId) => {
    return fakeRequest({
        url: "/task/cellDelete",
        method: "post",
        data: {
            taskId,
            classId,
            cellId,
        }
    }).catch(() => {})
}


