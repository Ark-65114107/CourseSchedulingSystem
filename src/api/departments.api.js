import request from "@/utils/request"

//获取院系数据
export const getDepartmentListApi = (parm)=>{
    return request({
        url:"/departments/list",
        method:"get",
        params:parm,
        isAbort:true

    }).catch(()=>{})
}

export const getDepartmentByQueryApi = (parm)=>{
    return request({
        url:"/departments/search",
        method:"post",
        data:parm,
        isAbort:true
    }).catch(()=>{})
}

//添加校区数据
export const addDepartmentApi = (parm)=>{
    return request({
        url:"/departments",
        method:"post",
        data:parm
    })
}
//修改校区数据
export const editDepartmentApi = (parm)=>{
    return request.put({
        url:"/departments",
        data:parm
    })
}

//删除校区数据
export const deleteDepartmentApi = (parm)=>{
    return request.delete({
        url:"/departments",
        data:parm
    })
}

