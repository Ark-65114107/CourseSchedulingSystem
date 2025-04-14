import request from "@/utils/request"

//获取院系数据
export const getDepartmentListApi = (parm)=>{
    return request({
        url:"/basicData/department/selectPage",
        method:"get",
        params:{
            pageNum:parm.page,
            pageSize:parm.size
        },
        isAbort:true
    }).catch(()=>{})
}

export const getDepartmentByQueryApi = (parm)=>{
    return request({
        url:"/basicData/department/selectById",
        method:"get",
        params:parm,
        isAbort:true
    }).catch(()=>{})
}
export const getSingleDepartmentApi = (id)=>{
    return request({
        url:`/basicData/department/selectById/${id}`,
        method:"get",
        isAbort:true
    }).catch(()=>{})
}

//获取所有部门数据
export const getAllDepartmentApi = ()=>{
    return request({
        url:"/departments/selectAll",
        method:"get",
        isAbort:true
    }).catch(()=>{})
}

//添加部门数据
export const addDepartmentApi = (data)=>{
    return request({
        url:"/basicData/department/update",
        method:"put",
        data 
    })
}
//修改部门数据
export const editDepartmentApi = (data)=>{
    return request({
        url:"/basicData/department/update",
        method:"put",
        data
    })
}

//删除部门数据
export const deleteDepartmentApi = (list)=>{
    return request({
        url:"/departments",
        method:"delete",
        data:{
            list
        }
    })
}

