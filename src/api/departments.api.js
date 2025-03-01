import request from "@/utils/request"

//获取校区数据
export const getDepartmentListApi = (parm)=>{
    return request({
        url:"/departments",
        method:"get",
        params:parm
    })
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

