import request from "@/utils/request"

//获取校区数据
export const getGradeListApi = (param)=>{
    return request({
        url:"/grades",
        method:"get",
        params:param
    })
}

//添加校区数据
export const addGradeApi = (param)=>{
    return request({
        url:"/grades",
        method:"post",
        data:parm
    })
}
//修改校区数据
export const editGradeApi = (param)=>{
    return request.put({
        url:"/grades",
        data:parm
    })
}

//删除校区数据
export const deleteGradeApi = (param)=>{
    return request.delete({
        url:"/grades",
        data:parm
    })
}

