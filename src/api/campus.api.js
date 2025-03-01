import request from "@/utils/request"

//获取校区数据
export const getCampusListApi = (parm)=>{
    return request({
        url:"/campuses",
        method:"get",
        params:parm
    })
}

//添加校区数据
export const addCampusApi = (parm)=>{
    return request({
        url:"/campuses",
        method:"post",
        data:parm
    })
}
//修改校区数据
export const editCampusApi = (parm)=>{
    return request.put({
        url:"/campuses",
        data:parm
    })
}

//删除校区数据
export const deleteCampusApi = (parm)=>{
    return request.delete({
        url:"/campuses",
        data:parm
    })
}

