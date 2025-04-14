import fakeRequest from "@/utils/fakeRequest"
import request from "@/utils/request"



//远程搜索班级列表
export const getCourseSuggestions = (taskId,classId,keyword)=>{
    return fakeRequest({
        url:"/task/getCourseSuggestions",
        method:"get",
        data:{
            taskId,
            classId,
            keyword,
        }
    }).catch(()=>{})
}
//获取某个班级的课程列表
export const getClassCourseListApi = (taskId,classId)=>{
    return fakeRequest({
        url:"/task/getClassCourseList",
        method:"get",
        data:{
            taskId,
            classId
        }
    }).catch(()=>{})
}
//添加某个班级的课程列表的课程
export const addClassCourseApi = (taskId,classId,newCourses)=>{
    return fakeRequest({
        url:"/task/addClassCourse",
        method:"post",
        data:{
            taskId,
            classId,
            newCourses,
        }
    }).catch(()=>{})
}

//删除某个班级的课程列表的课程
export const deleteClassCourseApi = (taskId,classId,courseId)=>{
    return fakeRequest({
        url:"/task/deleteCourse",
        method:"post",
        data:{
            taskId,
            classId,
            courseId,
        }
    }).catch(()=>{})
}
