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
