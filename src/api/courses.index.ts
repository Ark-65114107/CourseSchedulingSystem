import axios from 'axios';

const API_BASE_URL = '/api'; // 根据你的实际后端URL配置

/**
 * 获取课程数据
 * @param {Date} weekDate - 周次日期
 * @param {string} [scheduleType] - 课表类型（如班级ID或教师ID）
 * @returns {Promise<Array>} 课程数组
 */
export async function fetchCourseData(weekDate: Date, scheduleType?: string) {
  try {
    // 提取日期信息
    const year = weekDate.getFullYear();
    const month = String(weekDate.getMonth() + 1).padStart(2, '0');
    const day = String(weekDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    // 构建API请求参数
    const params: any = { date: dateStr };
    if (scheduleType) {
      params.type = scheduleType;
    }

    // 调用后端API
    return axios.get(`${API_BASE_URL}/course/schedule`, { params })
      .then(response => {
        // 解析响应数据
        console.log('API响应数据:', response.data);
        if (response.data && Array.isArray(response.data)) {
          return response.data;
        } else if (response.data && Array.isArray(response.data.courses)) {
          return response.data.courses;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          return response.data.data;
        } else {
          console.warn('API响应格式不符合预期，使用模拟数据');
          return getMockCourseData();
        }
      })
      .catch(error => {
        console.error('获取课程数据失败:', error);
        console.warn('由于API调用失败，使用模拟数据');
        return getMockCourseData();
      });
  } catch (error) {
    console.error('课程数据处理错误:', error);
    return getMockCourseData();
  }
}

/**
 * 获取课程详情
 * @param {number} courseId - 课程ID
 * @returns {Promise<Object>} 课程详情对象
 */
export async function fetchCourseDetail(courseId: number) {
  try {
    return axios.get(`${API_BASE_URL}/course/${courseId}`)
      .then(response => {
        console.log('获取课程详情成功:', response.data);
        // 如果API返回的数据格式正确，直接返回
        if (response.data && response.data.id) {
          return response.data;
        } else if (response.data && response.data.data && response.data.data.id) {
          return response.data.data;
        } else {
          console.warn('课程详情API响应格式不符合预期，使用模拟数据');
          return getMockCourseDetail(courseId);
        }
      })
      .catch(error => {
        console.error(`获取课程${courseId}详情失败:`, error);
        return getMockCourseDetail(courseId);
      });
  } catch (error) {
    console.error('课程详情数据处理错误:', error);
    return getMockCourseDetail(courseId);
  }
}

/**
 * 获取某个特定课表的数据
 * @param {Date} weekDate - 周次日期
 * @param {string} scheduleType - 课表类型
 * @returns {Promise<Array>} 课程数组
 */
export async function coursedata(weekDate: Date, scheduleType: string) {
  return fetchCourseData(weekDate, scheduleType);
}

// 模拟数据生成函数 - 在API调用失败时使用
function getMockCourseData() {
  return [
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
  ];
}

// 模拟课程详情数据 - 在API调用失败时使用
function getMockCourseDetail(courseId: number) {
  return {
    id: courseId,
    name: "高等数学",
    location: "教学楼A-301",
    teacher: "张教授",
    credits: 4,
    description: "本课程主要讲授微积分、线性代数等高等数学知识。",
    students: 45,
  };
}