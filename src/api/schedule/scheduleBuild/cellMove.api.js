import fakeRequest from "@/utils/fakeRequest"
import request from "@/utils/request"

//根据班级id获取对应班级的课表信息(排课)
export const cellMoveApi = (taskId,classId,cellId,before,after) => {
    return fakeRequest({
        url: "/task/cellMove",
        method: "post",
        data: {
            taskId,
            classId,
            cellId,
            before,
            after,
        }
    }).catch(() => {})
}


