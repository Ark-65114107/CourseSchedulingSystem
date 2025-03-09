import request from "@/utils/request"
import axios from "axios"

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



/**
 * 获取教师数据
 * 用于获取教师的基本信息，包括姓名、总课程数、今日课程数、本周课程数、在岗状态和学期状态
 * @returns {Promise<Object>} 教师信息对象
 */
export async function fetchTeacherData() {
  try {
    const response = await axios.get("/api/teacher/info")
    return response.data
  } catch (error) {
    console.error("获取教师数据失败:", error)
    // 返回默认数据，实际应用中可能需要更好的错误处理
    return {
      name: "张教授",
      totalCourses: 12,
      todayCourses: 2,
      weekCourses: 8,
      workStatus: "在岗",
      semesterStatus: "进行中",
    }
  }
}