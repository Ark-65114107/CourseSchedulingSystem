import request from "@/utils/request"

//获取学期数据
export const getSemesterListApi = (param)=>{
    return request({
        url:"/semesters",
        method:"get",
        params:param,
        isAbort:true
    }).catch(()=>{})
}

//添加专业数据
export const addMajorApi = (param)=>{
    return request({
        url:"/majors",
        method:"post",
        data:parm
    })
}
//修改专业数据
export const editMajorApi = (param)=>{
    return request.put({
        url:"/majors",
        data:parm
    })
}

//删除专业数据
export const deleteMajorApi = (param)=>{
    return request.delete({
        url:"/majors",
        data:parm
    })
}

