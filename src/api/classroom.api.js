import request from "@/utils/request"

//获取教室数据
export const getClassroomListApi = (parm)=>{
    return request({
        url:"/classrooms",
        method:"get",
        params:parm,
        isAbort:true
    }).catch(()=>{})
}

//添加教室数据
export const addClassroomApi = (parm)=>{
    return request({
        url:"/classrooms",
        method:"post",
        data:parm
    })
}
//修改教室数据
export const editClassroomApi = (parm)=>{
    return request.put({
        url:"/classrooms",
        data:parm
    })
}

//删除教室数据
export const deleteClassroomApi = (parm)=>{
    return request.delete({
        url:"/classrooms",
        data:parm
    })
}

