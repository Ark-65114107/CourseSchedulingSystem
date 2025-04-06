import request from "@/utils/request"
import { ElMessage } from "element-plus"

//获取路由
export const getRoutes = () => {
    return request({
        url: "/getRoutes",
        method: "get"
    }).then(error=>{
        ElMessage.error("网络错误!获取地址失败QAQ")
    })
}   