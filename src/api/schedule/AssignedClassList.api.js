import request from "@/utils/request"

//根据排课任务id获取已经添加了课程的班级数组
export const getAssignedClassListApi = (id)=>{
    return request({
        url:"/task/getAssignedClassList",
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

