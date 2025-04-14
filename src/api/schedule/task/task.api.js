import request from "@/utils/request"
import axios from "axios"

//获取排课任务列表数据
export const getTaskListApi = (parm)=>{
    // return request({
    //     url:"/task/list",
    //     method:"get",
    //     params:parm,
    //     isAbort:true
    // }).catch(()=>{})
        return axios.get("")
}


export const getTaskByQueryApi = (parm)=>{
    return request({
        url:"/task/search",
        method:"post",
        data:parm,
        isAbort:true
    }).catch(()=>{})
}
