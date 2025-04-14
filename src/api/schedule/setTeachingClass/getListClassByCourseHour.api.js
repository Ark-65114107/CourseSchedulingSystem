import fakeRequest from "@/utils/fakeRequest"
import request from "@/utils/request"

//获取课程下相同学时的教学班
export const getListClassByCourseHour = (taskId,courseId,courseHour,keyword)=>{
    return fakeRequest({
        url:"/task/getListClassByCourseHour",
        method:"get",
        params:{
            taskId,
            courseId,
            courseHour,
            keyword
        }
    }).catch(()=>{})
}
