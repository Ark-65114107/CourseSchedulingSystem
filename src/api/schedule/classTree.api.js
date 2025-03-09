import request from "@/utils/request"

//获取教室树状数据
export const getClassTreeApi = ()=>{
    return request({
        url:"/task/getClassTree",
        method:"get",
    }).catch(()=>{})
}
//提交指定id排课任务的教室树状数据
export const setClassTreeApi = (data)=>{
    return request({
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

