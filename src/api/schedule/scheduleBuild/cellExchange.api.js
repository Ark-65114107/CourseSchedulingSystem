import request from "@/utils/request"

//根据班级id获取对应班级的课表信息(排课)
export const cellExchangeApi = (taskId,classId,isTableCell,firstCellId,secondCellId,exchangeCellData) => {
    return request({
        url: "/task/cellExchange",
        method: "post",
        data: {
            taskId,
            classId,
            isTableCell,
            firstCellId,
            secondCellId,
            exchangeCellData,
        }
    }).catch(() => {})
}


