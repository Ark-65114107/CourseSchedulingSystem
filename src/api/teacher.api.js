import request from "@/utils/request"

//获取教师数据
export const getTeacherListApi = (parm)=>{
    return request({
        url:"/teachers",
        method:"get",
        params:parm,
        isAbort:true
    }).catch(()=>{})
}

//添加教师数据
export const addTeacherApi = (parm)=>{
    return request({
        url:"/teachers",
        method:"post",
        data:parm
    })
}
//修改教师数据
export const editTeacherApi = (parm)=>{
    return request.put({
        url:"/teachers",
        data:parm
    })
}

//删除教师数据
export const deleteTeacherApi = (parm)=>{
    return request.delete({
        url:"/teachers",
        data:parm
    })
}

