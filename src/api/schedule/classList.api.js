import request from "@/utils/request"

//根据排课任务id获取教室id数组
export const getClassListApi = (id)=>{
    return request({
        url:"/task/getClassList",
        method:"get",
        params:{
            id
        }
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

