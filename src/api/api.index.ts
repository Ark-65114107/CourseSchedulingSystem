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
  // 解析scheduleType格式，例如: "1/2/3" 表示 学期/专业/班级
  const [semester, majorId, classId] = scheduleType.split('/');

  return request({
    url: "/task/getScheduleTable", // 修改为实际的API端点
    method: "get",
    params: {
      date: date.toISOString().split('T')[0], // 格式化日期为 YYYY-MM-DD
      semester: semester || undefined,
      majorId: majorId || undefined,
      classId: classId || undefined,
      // 下面参数按需添加
      // campusId: undefined,
      // departmentId: undefined,
      // grade: undefined,
    }
  }).then(response => {
    console.log('API返回原始数据:', response);

    // 检查响应格式是否符合预期
    if (response && response.data && Array.isArray(response.data)) {
      // 处理meta中的状态码
      if (response.meta && response.meta.code !== 200) {
        console.warn('API返回非成功状态:', response.meta.message);
        return [];
      }

      // 将后端返回的数据转换为前端需要的格式
      return response.data.map(course => ({
        id: course.id,
        name: course.name,
        day: course.day - 1, // 后端是 1-7，前端需要 0-6
        startTime: course.startTime,
        endTime: course.endTime,
        location: course.location || '未指定地点',
        type: course.type || 'lecture', // 使用后端提供的类型
      }));
      // } else if (Array.isArray(response)) {
      //   // 兼容直接返回数组的情况
      //   return response.map(course => ({
      //     id: course.id,
      //     name: course.name,
      //     day: course.day - 1, // 后端是 1-7，前端需要 0-6
      //     startTime: course.startTime,
      //     endTime: course.endTime,
      //     location: course.location || '未指定地点',
      //     type: course.type || 'lecture',
      //   }));
    }

    // 如果没有数据或者格式不对，返回空数组
    console.warn('API返回数据格式不符合预期');
    return [];
  }).catch(error => {
    console.error('获取课程数据失败:', error);
    return [];
  });
};