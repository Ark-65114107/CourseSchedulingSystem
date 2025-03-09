/**
 * 获取教师数据
 * 用于获取教师的基本信息，包括姓名、总课程数、今日课程数、本周课程数、在岗状态和学期状态
 * @returns {Promise<Object>} 教师信息对象
 */
export async function fetchTeacherData() {
    // 直接返回模拟数据，不发送实际请求
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: "张教授",
          totalCourses: 6,
          todayCourses: 2,
          weekCourses: 12,
          workStatus: "在岗",
          semesterStatus: "进行中",
        })
      }, 300) // 模拟网络延迟
    })
  }
  
  