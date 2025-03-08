/**
 * 获取课程数据
 * @param {Date} weekDate - 周次日期
 * @returns {Promise<Array>} 课程数组
 */
export async function fetchCourseData(weekDate: Date) {
  // 直接返回模拟数据，不发送实际请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "高等数学",
          location: "教学楼A-301",
          day: 1, // 周二
          startTime: "08:00",
          endTime: "09:40",
          type: "lecture",
        },
        {
          id: 2,
          name: "大学物理实验",
          location: "实验楼B-201",
          day: 2, // 周三
          startTime: "14:00",
          endTime: "16:35",
          type: "lab",
        },
        {
          id: 3,
          name: "程序设计基础",
          location: "教学楼C-401",
          day: 4, // 周五
          startTime: "10:00",
          endTime: "11:40",
          type: "lecture",
        },
      ])
    }, 300) // 模拟网络延迟
  })
}

/**
 * 获取课程详情
 * @param {number} courseId - 课程ID
 * @returns {Promise<Object>} 课程详情对象
 */
export async function fetchCourseDetail(courseId: number) {
  // 模拟获取课程详情
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: courseId,
        name: "高等数学",
        location: "教学楼A-301",
        teacher: "张教授",
        credits: 4,
        description: "本课程主要讲授微积分、线性代数等高等数学知识。",
        students: 45,
      })
    }, 300)
  })
}

