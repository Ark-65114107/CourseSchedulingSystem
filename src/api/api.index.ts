import request from "@/utils/request"

//获取路由
export const getRoutes = () => {
  return request({
    url: "/task/getScheduleTable",
    method: "get"
  })
}

/**
 * 获取课程数据
 * @param date 当前日期
 * @param scheduleType 课表类型 (可选参数，默认为空字符串)
 * @returns 课程数据列表
 */
export const coursedata = (date: Date, scheduleType: string = '') => {
  return request({
    url: "/task/getScheduleTable",
    method: "get",
    params: {
      date: date.toISOString().split('T')[0], // 格式化日期为 YYYY-MM-DD
      type: scheduleType || undefined // 如果为空字符串则传 undefined
    }
  }).then(response => {
    // 假设API返回的是包含课程信息的数组
    // 如果需要对返回数据做转换处理，可以在这里添加逻辑
    // 示例：将后端返回的数据转换为前端需要的格式
    if (Array.isArray(response)) {
      return response.map(course => ({
        id: course.id,
        name: course.name,
        day: course.dayOfWeek - 1, // 假设后端是 1-7，前端需要 0-6
        startTime: course.startTime,
        endTime: course.endTime,
        location: course.location || '未指定地点',
        type: course.courseType || 'lecture', // 默认为普通课程
      }))
    }

    // 如果没有数据或者格式不对，返回空数组
    return []
  }).catch(error => {
    console.error('获取课程数据失败:', error)
    return []
  })
}