import fakeRequest from "@/utils/fakeRequest"
import request from "@/utils/request"

//添加新大课间
export const createLongBreakApi = (taskId)=>{
    return fakeRequest({
        url:"/task/createLongBreak",
        method:"post",
        data:{
            taskId
        }
    }).catch(()=>{})
}

//更新大课间
export const updateLongBreakApi = (taskId,index,period=1,duration=15)=>{
    return fakeRequest({
        url:"/task/updateLongBreak",
        method:"post",
        data:{
            taskId,
            index,
            period,
            duration,
        }
    }).catch(()=>{})
}

//删除大课间
export const deleteLongBreakApi = (taskId,index)=>{
    return fakeRequest({
        url:`/task/longBreak/${index}`,
        method:"delete",
        params:{
            taskId
        }
    }).catch(()=>{})
}

