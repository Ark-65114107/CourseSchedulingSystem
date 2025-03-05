import request from "@/utils/request"

//获取排课任务中的数据
export const getTaskListApi = (parm) => {
  return request({
    url: "/table",
    method: "get",
    params: parm
  })
}