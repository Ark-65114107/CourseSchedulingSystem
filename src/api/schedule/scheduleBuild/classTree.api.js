import fakeRequest from "@/utils/fakeRequest"
import request from "@/utils/request"

//获取班级树状数据
export const getClassTreeApi = ()=>{
    return fakeRequest({
        url:"/task/getScheduleClassTree",
        method:"get",
    }).catch(()=>{})
}
//提交指定id排课任务的班级树状数据
export const setClassTreeApi = (data)=>{
    return fakeRequest({
        url:"/task/setClassTree",
        method:"post",
        isAbort:true,
        data
        // data:{
        //     id:"",
        //      data:[]
        // }
    }).catch(()=>{})
}

